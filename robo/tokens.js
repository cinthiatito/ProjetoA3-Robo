export const regras = [
    { tipo: "ESPACO", padrao: /\s+/y, ignorar: true },
    { tipo: "COMENTARIO", padrao: /\/\/[^\r\n]*/y, ignorar: true },

    // Palavras-chave estruturais e de comandos de desenho
    { tipo: "TELA", padrao: /tela\b/y },
    { tipo: "LINHA", padrao: /linha\b/y },
    { tipo: "CIRCULO", padrao: /circulo\b/y },
    { tipo: "RETANGULO", padrao: /retangulo\b/y },
    { tipo: "GRUPO", padrao: /grupo\b/y },

    // Modificadores de grupo 
    { tipo: "ROTACAO", padrao: /rotacao/y },
    { tipo: "DESLOCAMENTO", padrao: /deslocamento/y },

    // Atributos de estilo 
    { tipo: "TRACO", padrao: /traco/y },
    { tipo: "PREENCHIMENTO", padrao: /preenchimento/y },
    { tipo: "ESPESSURA", padrao: /espessura/y },

    // Cores formato hexadecimal e lista fechada
    { tipo: "COR", padrao: /(?:vermelho|azul|verde|amarelo|branco|preto|roxo|laranja)\b/y },
    { tipo: "COR_HEX", padrao: /#[0-9A-Fa-f]{6}(?![A-Za-z0-9_])/y },
    
    // Números inteiros 
    { tipo: "NUM", padrao: /[0-9]+/y },

    // Delimitação de blocos de grupos
    { tipo: "ABRE", padrao: /\[/y },
    { tipo: "FECHA", padrao: /\]/y },
];