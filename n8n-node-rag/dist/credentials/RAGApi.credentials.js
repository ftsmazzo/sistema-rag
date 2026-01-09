"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAGApi = void 0;
class RAGApi {
    constructor() {
        this.name = 'ragApi';
        this.displayName = 'RAG API';
        this.documentationUrl = 'https://github.com/ftsmazzo/sistema-rag';
        this.properties = [
            {
                displayName: 'API URL',
                name: 'apiUrl',
                type: 'string',
                default: '',
                placeholder: 'https://seu-app.easypanel.host',
                required: true,
                description: 'URL base da sua instalação RAG',
            },
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
                description: 'Sua API Key (sk_...)',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.apiKey}}',
                    'Content-Type': 'application/json',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials.apiUrl}}',
                url: '/api/knowledge-bases',
                method: 'GET',
            },
        };
    }
}
exports.RAGApi = RAGApi;
