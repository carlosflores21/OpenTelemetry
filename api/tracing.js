const { NodeSDK } = require('@opentelemetry/sdk-node');
const { SimpleSpanProcessor, ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

class CustomConsoleSpanExporter extends ConsoleSpanExporter {
  export(spans, resultCallback) {
    spans.forEach(span => {
      const startTime = new Date(span.startTime[0] * 1000 + span.startTime[1] / 1e6);
      const endTime = new Date(span.endTime[0] * 1000 + span.endTime[1] / 1e6);
      const duration = endTime - startTime;

      console.log(`Span: ${span.name}`);
      console.log(`Trace ID: ${span.spanContext().traceId}`);
      console.log(`Span ID: ${span.spanContext().spanId}`);
      console.log(`Parent Span ID: ${span.parentSpanId}`);
      console.log(`Duration: ${duration} ms`);
      console.log(`Attributes: ${JSON.stringify(span.attributes)}`);
      console.log('-----------------------------------');
    });
    resultCallback({ code: 0 });
  }
}

// Configuración básica de OpenTelemetry
const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'carlosflores-app', // Cambia el nombre del servicio
  }),
  spanProcessor: new SimpleSpanProcessor(new CustomConsoleSpanExporter()), // Exportar trazas a consola
  instrumentations: [
    new HttpInstrumentation(), // Para instrumentar automáticamente peticiones HTTP
  ],
});

// Iniciar
sdk.start();
console.log('OpenTelemetry inicializado');

// Apagar
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('OpenTelemetry apagado'))
    .catch((error) => console.error('Error apagando OpenTelemetry', error))
    .finally(() => process.exit(0));
});