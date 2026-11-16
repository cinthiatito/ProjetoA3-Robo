Teste 1 – Programa válido
tela 400 300

circulo 50 50 25 preenchimento azul

Teste 2 – Grupo aninhado
tela 800 600

grupo deslocamento 100 100 [
    circulo 0 0 30 preenchimento vermelho

    grupo rotacao 45 [
        linha 0 0 60 0 traco preto
    ]
]

Teste 3 – Erro léxico
tela 400 300

triangulo 10 20 30

Teste 4 – Erro sintático
tela 400 300

linha 10 20 30

