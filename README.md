# Formulario de carga de cuidado · Yarú Rural

Formulario web en español para reconocer la carga de cuidado, la movilidad, el apoyo familiar, el descanso y los cruces horarios que pueden afectar la permanencia en Yarú Rural.

Incluye:
- Formulario de 8 preguntas con navegación por pasos.
- Semáforo verde, amarillo y rojo.
- Recomendaciones diferentes para cada nivel.
- Cálculo local en el navegador; no envía respuestas a un servidor.
- Identidad visual basada en Fundación WWB Colombia.
- Pruebas unitarias para los umbrales de clasificación.

Ejecutar localmente:
1. Instala Node.js.
2. Ejecuta: node serve.mjs
3. Abre: http://127.0.0.1:4173/

Ejecutar las pruebas:
node --test test/score.test.mjs

El resultado es orientativo; no es un diagnóstico médico ni una evaluación del compromiso de la participante.
