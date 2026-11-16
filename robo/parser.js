export function analisarSintatico(tokens) {
    let i = 0;

    // Verifica se o próximo token é o esperado
    function esperar(tipo) {
        const token = tokens[i];

        if (token === undefined) {
            const linha = tokens.length > 0
                ? tokens[tokens.length - 1].linha
                : 1;

            throw new Error(
                "Erro sintático na linha " + linha +
                ": esperado " + tipo + ", mas o programa terminou"
            );
        }

        if (token.tipo !== tipo) {
            throw new Error(
                "Erro sintático na linha " + token.linha +
                ": esperado " + tipo +
                ", encontrado " + token.tipo
            );
        }

        i++;
        return token;
    }

    // Verifica se o próximo token inicia um elemento
    function comecaElemento() {
        const token = tokens[i];

        if (!token) return false;

        return (
            token.tipo === "RETANGULO" ||
            token.tipo === "CIRCULO" ||
            token.tipo === "LINHA" ||
            token.tipo === "GRUPO"
        );
    }

    // Analisa os atributos opcionais das formas
    function analisarEstilos() {
        const estilos = [];
        const utilizados = new Set();

        while (i < tokens.length) {
            const token = tokens[i];
            let atributo;

            if (
                token.tipo === "PREENCHIMENTO" ||
                token.tipo === "TRACO"
            ) {
                esperar(token.tipo);

                const corToken = tokens[i];

                if (
                    !corToken ||
                    (corToken.tipo !== "COR" &&
                     corToken.tipo !== "COR_HEX")
                ) {
                    const linha = corToken
                        ? corToken.linha
                        : tokens[i - 1].linha;

                    throw new Error(
                        "Erro sintático na linha " + linha +
                        ": esperado uma cor, encontrado " +
                        (corToken ? corToken.tipo : "fim do programa")
                    );
                }

                i++;

                atributo = {
                    tipo: token.tipo === "TRACO"
                        ? "traco"
                        : "preenchimento",
                    valor: corToken.lexema
                };

            } else if (token.tipo === "ESPESSURA") {
                esperar("ESPESSURA");

                const numero = esperar("NUM");

                atributo = {
                    tipo: "espessura",
                    valor: Number(numero.lexema)
                };

            } else {
                break;
            }

            // Impede que o mesmo atributo apareça duas vezes
            if (utilizados.has(atributo.tipo)) {
                throw new Error(
                    "Erro sintático na linha " + token.linha +
                    ": atributo " + atributo.tipo +
                    " repetido"
                );
            }

            utilizados.add(atributo.tipo);
            estilos.push(atributo);
        }

        return estilos;
    }

    // Analisa os modificadores de um grupo
    function analisarModificadores() {
        const modificadores = [];
        const utilizados = new Set();

        while (i < tokens.length) {
            const token = tokens[i];
            let modificador;

            if (token.tipo === "ROTACAO") {
                esperar("ROTACAO");

                const angulo = esperar("NUM");

                modificador = {
                    tipo: "rotacao",
                    valores: [Number(angulo.lexema)]
                };

            } else if (token.tipo === "DESLOCAMENTO") {
                esperar("DESLOCAMENTO");

                const dx = esperar("NUM");
                const dy = esperar("NUM");

                modificador = {
                    tipo: "deslocamento",
                    valores: [
                        Number(dx.lexema),
                        Number(dy.lexema)
                    ]
                };

            } else {
                break;
            }

            // Impede a repetição de modificadores
            if (utilizados.has(modificador.tipo)) {
                throw new Error(
                    "Erro sintático na linha " + token.linha +
                    ": modificador " + modificador.tipo +
                    " repetido"
                );
            }

            utilizados.add(modificador.tipo);
            modificadores.push(modificador);
        }

        return modificadores;
    }

    // Analisa uma forma geométrica ou um grupo
    function elemento() {
        const token = tokens[i];

        if (!token) {
            throw new Error(
                "Erro sintático: esperado um elemento de desenho, mas o programa terminou"
            );
        }

        // RETÂNGULO
        if (token.tipo === "RETANGULO") {
            esperar("RETANGULO");

            const x = esperar("NUM");
            const y = esperar("NUM");
            const largura = esperar("NUM");
            const altura = esperar("NUM");

            const atributos = analisarEstilos();

            return {
                tipo: "retangulo",
                x: Number(x.lexema),
                y: Number(y.lexema),
                largura: Number(largura.lexema),
                altura: Number(altura.lexema),
                atributos: atributos
            };
        }

        // CÍRCULO
        if (token.tipo === "CIRCULO") {
            esperar("CIRCULO");

            const x = esperar("NUM");
            const y = esperar("NUM");
            const raio = esperar("NUM");

            const atributos = analisarEstilos();

            return {
                tipo: "circulo",
                x: Number(x.lexema),
                y: Number(y.lexema),
                raio: Number(raio.lexema),
                atributos: atributos
            };
        }

        // LINHA
        if (token.tipo === "LINHA") {
            esperar("LINHA");

            const x1 = esperar("NUM");
            const y1 = esperar("NUM");
            const x2 = esperar("NUM");
            const y2 = esperar("NUM");

            const atributos = analisarEstilos();

            return {
                tipo: "linha",
                x1: Number(x1.lexema),
                y1: Number(y1.lexema),
                x2: Number(x2.lexema),
                y2: Number(y2.lexema),
                atributos: atributos
            };
        }

        // GRUPO
        if (token.tipo === "GRUPO") {
            esperar("GRUPO");

            const modificadores = analisarModificadores();

            esperar("ABRE");

            const elementos = [];

            // Analisa os elementos que estão dentro do grupo
            while (
                i < tokens.length &&
                tokens[i].tipo !== "FECHA"
            ) {
                elementos.push(elemento());
            }

            esperar("FECHA");

            return {
                tipo: "grupo",
                modificadores: modificadores,
                elementos: elementos
            };
        }

        throw new Error(
            "Erro sintático na linha " + token.linha +
            ": esperado uma forma ou grupo, encontrado " + token.tipo
        );
    }

    // INÍCIO DO PROGRAMA

    // A tela é obrigatória e deve ser a primeira instrução
    esperar("TELA");

    const larguraTela = esperar("NUM");
    const alturaTela = esperar("NUM");

    // Analisa todos os elementos do desenho
    const elementos = [];

    while (comecaElemento()) {
        elementos.push(elemento());
    }

    // Verifica se existem tokens sobrando
    if (i < tokens.length) {
        const token = tokens[i];

        throw new Error(
            "Erro sintático na linha " + token.linha +
            ": esperado o fim do programa, encontrado " + token.tipo
        );
    }

    // Retorna a AST completa
    return {
        tipo: "programa",
        tela: {
            largura: Number(larguraTela.lexema),
            altura: Number(alturaTela.lexema)
        },
        elementos: elementos
    };
}
