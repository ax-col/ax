// worker.js
self.onmessage = async (e) => {
    const { query, knowledge } = e.data;
    
    // Procesamiento pesado en worker
    const embedding = await generateEmbedding(query);
    const results = await searchKnowledge(embedding, knowledge);
    
    self.postMessage({ results });
};

// Main thread
const worker = new Worker('worker.js');
worker.postMessage({ query: "¿Qué es la IA?" });
worker.onmessage = (e) => updateUI(e.data.results);