import { Controller } from '@nestjs/common';
import { WeaviateService } from './weaviate.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('weaviate')
export class WeaviateController {
    constructor(private readonly weaviateService: WeaviateService) {}

    @GrpcMethod('WeaviateService', 'StorePdfDocument')
    async storePdfDocument(data: { file_path: string }): Promise<{message: string}> {
        const message = await this.weaviateService.storePdfDocument(data.file_path);       
        
        return { message };
    }

    @GrpcMethod('WeaviateService', 'StoreDocument')
    async storeDocument(data: { text: string; source: string}): Promise<{message: string}> {
        const message = await this.weaviateService.storeDocument(data.text, data.source);       
        
        return { message };
    }

    @GrpcMethod('WeaviateService', 'DeleteDocument')
    async deleteDocument(data: { document_id: string }): Promise<{message: string}> {
        const message = await this.weaviateService.deleteDocument(data.document_id);       
        
        return { message };
    }

    @GrpcMethod('WeaviateService', 'FindSimilar')
    async findSimilar(data: { query: string; k: number }): Promise<{results: string[]}> {
        let results: string[] = []
        results = await this.weaviateService.findSimilar(data.query, data.k);   
            
        return { results };
    }
}
