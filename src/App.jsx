import React, { useState } from 'react';
import './App.css';
import { questions } from './data/questions';
import { areas } from './data/areas';
import { gabarito } from './data/gabarito';
import ResultChart from './components/ResultChart';

function App() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
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
        <thead >
          <tr>
            <td>Detesto/detestaria exercer essa atividade</td>
            <td>Não gosto/não gostaria de exercer essa atividade</td>
            <td>Imparcial/neutro(a) a esta atividade</td>
            <td>Gosto/gostaria de exercer essa atividade</td>
            <td>Adoro/adoraria exercer essa atividade</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
            <td>5</td>
          </tr>
        </tbody>
      </table>
      <br /><br />
      <form>
        {questions.map((q, i) => (
          <div key={i} className="question">
            <label>{i + 1}. {q}</label>
            <select value={answers[i]} onChange={(e) => handleChange(i, e.target.value)}>
              <option value="">Selecione</option>
              {[1, 2, 3, 4, 5].map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
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
                  <th>Escore</th>
                  <th>Classificação</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(results).map(([area, score]) => (
                  <tr key={area}>
                    <td>{area}</td>
                    <td>{score}</td>
                    <td>{score >= gabarito[area].bruto ? gabarito[area].classif : "BAIXO"}</td>
                  </tr>
                ))}
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