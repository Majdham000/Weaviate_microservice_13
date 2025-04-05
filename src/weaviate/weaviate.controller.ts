import { Controller } from '@nestjs/common';
import { WeaviateService } from './weaviate.service';
import { GrpcMethod } from '@nestjs/microservices';
import { StoreRequest, StoreResponse, DeleteRequest, DeleteResponse, FindRequest, FindResponse } from 'proto/rag';


@Controller('weaviate')
export class WeaviateController {
    constructor(private readonly weaviateService: WeaviateService) {}

    // @GrpcMethod('WeaviateService', 'StorePdfDocument')
    // async storePdfDocument(data: { file_path: string }): Promise<{message: string}> {
    //     const message = await this.weaviateService.storePdfDocument(data.file_path);       
        
    //     return { message };
    // }

    @GrpcMethod('WeaviateService', 'StoreDocument')
    async storeDocument(data: StoreRequest): Promise<StoreResponse> {
        const message = await this.weaviateService.storeDocument(data.documents);       
        
        return { message };
    }

    @GrpcMethod('WeaviateService', 'DeleteDocument')
    async deleteDocument(data: DeleteRequest): Promise<DeleteResponse> {
        const message = await this.weaviateService.deleteDocument(data.documentId);       
        
        return { message };
    }

    @GrpcMethod('WeaviateService', 'FindSimilar')
    async findSimilar(data: FindRequest): Promise<FindResponse> {
        let results: string[] = []
        results = await this.weaviateService.findSimilar(data.query, data.k);   
            
        return { results };
    }
}
