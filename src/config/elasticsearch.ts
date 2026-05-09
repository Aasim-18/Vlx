export const connectElasticsearch = async (): Promise<void> => {
  const elasticsearchNode = process.env.ELASTICSEARCH_NODE ?? "";
  if (!elasticsearchNode) return;

  // Elasticsearch connection bootstrap point.
  void elasticsearchNode;
};
