import React, { useState } from 'react';
import './App.css';
import { questions } from './data/questions';
import { areas } from './data/areas';
import ResultChart from './components/ResultChart';
import { percentis } from './data/percentis';

const percentilSteps = [10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90];

function classificarPorPercentil(area, score) {
  const valores = percentis[area];
  if (!valores) return "Indefinido";

  if (score <= valores[2]) return "Baixo";
  if (score <= valores[7]) return "Médio";
  return "Alto";
} 

function obterPercentil(area, score) {
  const valores = percentis[area];
  if (!valores) return [null, "Indefinido"];

  for (let i = 0; i < valores.length; i++) {
    if (score <= valores[i]) {
      return [percentilSteps[i], classificarFaixa(i)];
    }
  }
  return [percentilSteps[percentilSteps.length - 1], "Alto"];
}

function classificarFaixa(index) {
  if (index <= 2) return "Baixo";
  if (index <= 7) return "Médio";
  return "Alto";
}

function App() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(2));
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value === '' ? '' : parseInt(value);
    setAnswers(updated);
    if (error) setError('');
  };

  const calculateResults = () => {
    if (answers.some(a => a === '')) {
      setError('Todos os campos são obrigatórios. Por favor, preencha todas as respostas antes de ver o resultado.');
      return;
    }
    const scores = {};
    for (const area in areas) {
      const total = areas[area].reduce((sum, i) => {
        const val = answers[i - 1];
        return sum + (typeof val === 'number' ? val : 0);
      }, 0);
      scores[area] = total;
    }
    setResults(scores);
    setError('');
  };

  return (
    <div className="container">
      <h1>Escala de Interesses por Áreas da Psicologia</h1>
      <p>Por favor, responda às seguintes perguntas avaliando seu interesse em cada atividade de 1 (nenhum interesse) a 5 (muito interesse).</p>

    <table border="1" cellpadding="10" cellspacing="0">
      <thead>
        <tr>
          <th>Valor</th>
          <th>Descrição</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Detesto/detestaria exercer essa atividade</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Não gosto/não gostaria de exercer essa atividade</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Imparcial/neutro(a) a esta atividade</td>
        </tr>
        <tr>
          <td>4</td>
          <td>Gosto/gostaria de exercer essa atividade</td>
        </tr>
        <tr>
          <td>5</td>
          <td>Adoro/adoraria exercer essa atividade</td>
        </tr>
      </tbody>
    </table>
      <br /><br />
      <form>
        {questions.map((q, i) => (
          <div key={i} className="question">
            <label>{i + 1}. {q}</label>
            <div>
              {[1, 2, 3, 4, 5].map(val => (
                <label key={val} style={{ marginLeft: '10px' }}>
                  <input
                    type="radio"
                    name={`answer-${i}`}
                    value={val}
                    checked={answers[i] === val}
                    onChange={() => handleChange(i, val)}
                  />
                  {val}
                </label>
              ))}
            </div>
            <br /><br />
          </div>
        ))}
      </form>
      <button
        type="button"
        onClick={calculateResults}
      >
        Ver Resultado
      </button>
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </div>
      )}

      {results && (
        <>
          <div className="results">
            <h2>Resultado</h2>
            <table>
              <thead>
                <tr>
                  <th>Área</th>
                  <th>Pontuação</th>
                  <th>Percentil</th>
                  <th>Classificação</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(results).map(([area, score]) => {
                  const [percentil, faixa] = obterPercentil(area, score);
                  return (
                    <tr key={area}>
                      <td>{area}</td>
                      <td>{score}</td>
                      <td>{percentil}</td>
                      <td>{faixa}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <ResultChart scores={results} />
        </>
      )}
    </div>
  );
}

export default App;