import { TogetherAIEmbeddings } from "@langchain/community/embeddings/togetherai";
import { Chroma } from "@langchain/community/vectorstores/chroma";

type ApiResponse<T> = Promise<T>;

/**
 * @description Create a new instance of the IndexVectorStore from the Chroma class
 * @param embeddings
 * @param options
 *
 **/
export default class IndexVectorStore extends Chroma {
  private db: any;

  constructor(embeddings: TogetherAIEmbeddings, args: any) {
    super(embeddings, args);
  }

  /**
   * @description Add a document to the ChromaDB [NOT SUPPORTED]
   *
   * @param document
   */
  override async addDocuments(): Promise<any> {
    throw new Error(
      "Method is not supported. Use IndexClient.addIndexItem() method.",
    );
  }

  /**
   * @description Add a document vectos to the ChromaDB [NOT SUPPORTED]
   *
   * @param document
   */
  override async addVectors(): Promise<any> {
    throw new Error(
      "Method is not supported. Use IndexClient.addIndexItem() method.",
    );
  }

  /**
   * @description Delete a document from the ChromaDB
   *
   * @param indexIds
   * @param query
   * @param update
   */
  override async delete(): Promise<any> {
    throw new Error(
      "Method is not supported. Use IndexClient.deleteIndexItem() method.",
    );
  }
}
