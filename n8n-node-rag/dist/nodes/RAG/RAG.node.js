"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAG = void 0;
class RAG {
    constructor() {
        this.description = {
            displayName: 'RAG Knowledge Base',
            name: 'rag',
            icon: 'file:nodes/RAG/rag.svg',
            iconColor: '#6366F1',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'Query your RAG Knowledge Base with semantic search',
            defaults: {
                name: 'RAG Knowledge Base',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'ragApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Query Knowledge Base',
                            value: 'query',
                            description: 'Search and get AI answer from a knowledge base',
                            action: 'Query a knowledge base',
                        },
                        {
                            name: 'List Knowledge Bases',
                            value: 'list',
                            description: 'Get all available knowledge bases',
                            action: 'List all knowledge bases',
                        },
                    ],
                    default: 'query',
                },
                {
                    displayName: 'Knowledge Base',
                    name: 'knowledgeBaseId',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getKnowledgeBases',
                    },
                    displayOptions: {
                        show: {
                            operation: ['query'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'Select the knowledge base to query',
                },
                {
                    displayName: 'Query',
                    name: 'query',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['query'],
                        },
                    },
                    default: '',
                    required: true,
                    placeholder: 'What is the refund policy?',
                    description: 'Your question or search query',
                },
                {
                    displayName: 'Top K Results',
                    name: 'topK',
                    type: 'number',
                    typeOptions: {
                        minValue: 1,
                        maxValue: 20,
                    },
                    displayOptions: {
                        show: {
                            operation: ['query'],
                        },
                    },
                    default: 5,
                    description: 'Number of most relevant results to return (1-20)',
                },
            ],
        };
        this.methods = {
            loadOptions: {
                async getKnowledgeBases() {
                    const credentials = await this.getCredentials('ragApi');
                    const apiUrl = credentials.apiUrl;
                    try {
                        const response = await this.helpers.httpRequest({
                            method: 'GET',
                            url: `${apiUrl}/api/knowledge-bases`,
                            headers: {
                                Authorization: `Bearer ${credentials.apiKey}`,
                                'Content-Type': 'application/json',
                            },
                        });
                        if (response.success && Array.isArray(response.data)) {
                            return response.data
                                .filter((kb) => kb.isActive === true || kb.isActive === 1)
                                .map((kb) => ({
                                name: kb.name,
                                value: kb.id,
                            }));
                        }
                        return [];
                    }
                    catch (error) {
                        console.error('Error loading knowledge bases:', error);
                        return [];
                    }
                },
            },
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const operation = this.getNodeParameter('operation', 0);
        const credentials = await this.getCredentials('ragApi');
        const apiUrl = credentials.apiUrl;
        for (let i = 0; i < items.length; i++) {
            try {
                if (operation === 'list') {
                    // List knowledge bases
                    const response = await this.helpers.httpRequest({
                        method: 'GET',
                        url: `${apiUrl}/api/knowledge-bases`,
                        headers: {
                            Authorization: `Bearer ${credentials.apiKey}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.success && Array.isArray(response.data)) {
                        returnData.push({
                            json: {
                                knowledgeBases: response.data,
                                count: response.data.length,
                            },
                        });
                    }
                    else {
                        returnData.push({
                            json: {
                                error: 'Failed to fetch knowledge bases',
                                response,
                            },
                        });
                    }
                }
                else if (operation === 'query') {
                    // Query knowledge base
                    const knowledgeBaseId = this.getNodeParameter('knowledgeBaseId', i);
                    const query = this.getNodeParameter('query', i);
                    const topK = this.getNodeParameter('topK', i, 5);
                    const response = await this.helpers.httpRequest({
                        method: 'POST',
                        url: `${apiUrl}/api/kb/${knowledgeBaseId}/query`,
                        headers: {
                            Authorization: `Bearer ${credentials.apiKey}`,
                            'Content-Type': 'application/json',
                        },
                        body: {
                            query,
                            topK,
                        },
                    });
                    if (response.success && response.data) {
                        returnData.push({
                            json: {
                                answer: response.data.answer,
                                sources: response.data.sources || [],
                                knowledgeBase: response.data.knowledgeBase || {},
                                query,
                                topK,
                            },
                        });
                    }
                    else {
                        returnData.push({
                            json: {
                                error: response.error || 'Query failed',
                                response,
                            },
                        });
                    }
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message || 'Unknown error',
                            details: error.response?.data || error,
                        },
                    });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.RAG = RAG;
