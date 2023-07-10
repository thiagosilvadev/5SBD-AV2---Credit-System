# Cooperativa de Crédito AGrana

A cooperativa de crédito AGrana empresta dinheiro a trabalhadores de empresas associadas com uma
taxa de juros diferenciada. O Sr. Ricardo, presidente da cooperativa, convidou a empresa XPTOTec para
desenvolver o controle dos empréstimos em tecnologia WEB. O sistema deverá controlar os valores
emprestados a cada associado, bem como sua margem consignada, ou seja, o limite de endividamento
do associado.
A cooperativa tem um corpo de vendedores que são comissionados na venda pelo total de parcelas
pagas no primeiro ano de contrato. O sistema deverá controlar as comissões e valores pagos aos
vendedores.
O funcionário associado pode financiar qualquer bem durável, para isso deverá fazer um contrato de
financiamento dando o bem comprado em garantia do empréstimo. A pessoa financiada deverá ter o
nome limpo na praça. O financiamento pode ser feito em até 24 meses e o limite de endividamento
mensal será 30% do seu salário mensal. O pagamento deverá ser efetuado através de consignação em
folha de pagamento. As parcelas deverão ter seu pagamento controlado e caso alguém não pague por
dois meses consecutivos, o seu registro deverá ir para o SPC.
O cálculo das parcelas e a taxa de juros dos financiamentos deverão ser configuráveis no sistema. A
empresa associada receberá uma comissão do total de prestações pagas todo mês e será configurável no
sistema.
```plantuml

class CooperativaDeCredito {
  - taxaJuros: float
  - comissaoEmpresaAssociada: float
  + emprestarDinheiro(associado: Associado, valor: float): void
  + calcularParcela(valor: float, prazo: int): float
}

class Associado {
  - nome: string
  - salario: float
  - limiteEndividamento: float
  - margemConsignada: float
  - restricaoCredito: bool
  - parcelasPagas: int
  + verificarRestricaoCredito(): bool
  + registrarPagamentoParcela(): void
  + verificarRegistroSPC(): void
}

class Vendedor {
  - nome: string
  - comissao: float
  + calcularComissao(parcelasPagas: int): float
}

class BemDuravel {
  - nome: string
  - valor: float
}

CooperativaDeCredito --> Associado
CooperativaDeCredito --> Vendedor
Associado --> BemDuravel

```