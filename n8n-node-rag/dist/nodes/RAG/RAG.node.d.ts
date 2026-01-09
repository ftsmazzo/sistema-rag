import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
export declare class RAG implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getKnowledgeBases(this: IExecuteFunctions): Promise<Array<{
                name: string;
                value: number;
            }>>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
