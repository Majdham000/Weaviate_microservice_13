import { Injectable, OnModuleInit } from '@nestjs/common';

import { WeaviateStore } from "@langchain/weaviate";
import { OpenAIEmbeddings } from "@langchain/openai";

import weaviate from "weaviate-ts-client";
import { ApiKey } from "weaviate-ts-client"

import type { Document } from "@langchain/core/documents";
import { UUIDTypes, v4 as uuidv4 } from "uuid";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { ConfigService } from '@nestjs/config';
import { UUID } from 'crypto';


@Injectable()
export class WeaviateService {
    private embeddings: OpenAIEmbeddings;
    private vectorStore: WeaviateStore;
    private weaviateClient;

    constructor(private configService: ConfigService){
        console.log("creating vector database");
        
        this.embeddings = new OpenAIEmbeddings({
            openAIApiKey: this.configService.get<string>('OPENAI_API_KEY')
        });
        
        
        this.weaviateClient = (weaviate as any).client({
            scheme: "https",
            host: this.configService.get<string>('WCD_URL'),
            apiKey: new ApiKey(this.configService.get<string>('WCD_API_KEY') as string),
        });
        
        this.vectorStore = new WeaviateStore(this.embeddings, {
            client: this.weaviateClient,
            indexName: "Documents",
            textKey: "text",
            metadataKeys: ["source"],
        });

    }

    async storeDocument(documents: {id: string; text: string; source: string}[]): Promise<string> {
        let documentsToStore: Document[] = []
        let ids: string[] = []

        for (const doc of documents) {
            const document: Document = {
                id: doc.id ?? uuidv4(),
                pageContent: doc.text,
                metadata: { source: doc.source }
            };

            documentsToStore.push(document)
            ids.push(document.id ?? uuidv4())

        }

        await this.vectorStore.addDocuments(documentsToStore, { ids: ids });

        // console.log(documentsToStore);
        // console.log(ids);

        return "Documents added succesfully.";
    }

    async storePdfDocument(file_path: string): Promise<string> {
        const loader = new PDFLoader(file_path)

        const docs : Document[] = await loader.load();
        

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 200,   
            chunkOverlap: 20, 
        });

        const splitDocs : Document[] = await splitter.splitDocuments(docs)

        const formattedDocs : Document[] = splitDocs.map((doc) => ({
            pageContent: doc.pageContent,
            metadata: {
                source: doc.metadata.source,  
                //page: doc.metadata.loc?.pageNumber,
            },
            id: uuidv4(),
        }));

        let uuids: string[] = [];
        
        for (const doc of formattedDocs) {
            uuids.push(doc.id ?? uuidv4());
        }
        
        await this.vectorStore.addDocuments(formattedDocs, { ids: uuids });

        // console.log(formattedDocs[0]);

        return "Document added succesfully.";
    }

    async deleteDocument(document_id: string): Promise<string> {
        await this.vectorStore.delete({ ids: [document_id] });
        return "Document deleted succesfully.";
    }

    async findSimilar(query: string, k: number): Promise<string[]> {
        // const filter = {
        //     where: {
        //         operator: "Equal" as const,
        //         path: ["source"],
        //         valueText: "https://example.com",
        //     },
        //     };

        const results: string[] = []
        
        const similaritySearchResults = await this.vectorStore.similaritySearch(
        query,
        k
        // filter
        );
        
        // console.log(similaritySearchResults);
        
        
        for (const doc of similaritySearchResults) {
            //console.log(`* ${doc.pageContent} [${JSON.stringify(doc.metadata, null)}]`);
            results.push(doc.pageContent);
        }
                
        return results;

    }
    

}
