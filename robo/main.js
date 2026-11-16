import { analisarLexico } from "./lexer.js";
import { analisarSintatico } from "./parser.js";

// Exemplo 
const exemplo = `tela 400 300
// um carro simples
retangulo 50 150 200 60 preenchimento azul
grupo deslocamento 70 190 [
    circulo 0 0 25 preenchimento preto
    grupo rotacao 45 [
        linha 0 0 20 0 traco branco espessura 2
    ]
]
grupo deslocamento 200 190 [
]
circulo 0 0 25 preenchimento preto`;

document.getElementById("entrada").value = exemplo;

function analisar() {
    const texto = document.getElementById("entrada").value;
    const resultado = analisarLexico(texto);
    console.log(resultado);
    
    const tokens = resultado.tokens;
    const erros = resultado.erros;

    const linhas = [];

    for (const token of tokens) {
        const onde = "linha " + token.linha + "  ";
        const nome = token.tipo.padEnd(12);
        const lexema = '"' + token.lexema + '"';
        linhas.push(onde + nome + lexema);
    }

    linhas.push("");

    if (erros.length > 0) {
        for (const erro of erros) {
            linhas.push('Erro léxico na linha ' + erro.linha + ': "' + erro.lexema + '" não forma nenhum token');
        }
    } else {
        try {
            const ast = analisarSintatico(tokens);
            linhas.push("Análise sintática: programa válido");
            linhas.push(JSON.stringify(ast, null, 2));
            console.log("AST", ast);
        } catch (falha) {
            linhas.push(falha.message);
        }
    }

    document.getElementById("saida").textContent = linhas.join("\n");
}

document.getElementById("botao").addEventListener("click", analisar);