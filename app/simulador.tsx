import Decimal from "decimal.js";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

// Precisão global
Decimal.set({ precision: 50 });

// Truncar/arredondar conforme Python
function truncar(numero: Decimal, numDigitos: number): Decimal {
  if (numero.isZero()) return new Decimal(0);
  const expoente = numero.e;
  const casasDecimais = numDigitos - expoente - 1;
  return numero.toDecimalPlaces(casasDecimais, Decimal.ROUND_DOWN);
}
function arredondar(numero: Decimal, numDigitos: number): Decimal {
  if (numero.isZero()) return new Decimal(0);
  const expoente = numero.e;
  const casasDecimais = numDigitos - expoente - 1;
  return numero.toDecimalPlaces(casasDecimais, Decimal.ROUND_HALF_UP);
}

// Operações
type OperacaoTipo = "+" | "-" | "*" | "/";
const operacoes: Record<OperacaoTipo, (x: Decimal, y: Decimal) => Decimal> = {
  "+": (x, y) => x.plus(y),
  "-": (x, y) => x.minus(y),
  "*": (x, y) => x.times(y),
  "/": (x, y) => (y.equals(0) ? new Decimal(Infinity) : x.div(y)),
};

// Operação única
function calcularOperacaoUnica(
  xTxt: string,
  yTxt: string,
  operacao: OperacaoTipo,
  numDigitos: number,
  metodo: "Truncamento" | "Arredondamento"
) {
  const x = new Decimal(xTxt);
  const y = new Decimal(yTxt);
  const valorExato = operacoes[operacao](x, y);

  const funcaoAjuste = metodo === "Truncamento" ? truncar : arredondar;
  const xAprox = funcaoAjuste(x, numDigitos);
  const yAprox = funcaoAjuste(y, numDigitos);
  const resultadoParcial = operacoes[operacao](xAprox, yAprox);
  const valorAproximado = funcaoAjuste(resultadoParcial, numDigitos);

  const erroAbs = valorExato.minus(valorAproximado).abs();
  const erroRel = valorExato.equals(0)
    ? new Decimal(0)
    : erroAbs.div(valorAproximado).abs();

  return { xAprox, yAprox, valorExato, valorAproximado, erroAbs, erroRel };
}

// Somas sequenciais
function simularSomasSequenciais(
  numeroTxt: string,
  totalSomas: number,
  numDigitos: number,
  metodo: "Truncamento" | "Arredondamento"
) {
  const numero = new Decimal(numeroTxt);
  const funcaoAjuste = metodo === "Truncamento" ? truncar : arredondar;

  const valorExatoFinal = numero.times(totalSomas);
  let somaAcumulada = new Decimal(0);
  const passos: Decimal[] = [];
  for (let i = 0; i < totalSomas; i++) {
    somaAcumulada = somaAcumulada.plus(numero);
    somaAcumulada = funcaoAjuste(somaAcumulada, numDigitos);
    passos.push(somaAcumulada);
  }
  const valorAproximadoFinal = somaAcumulada;
  const erroAbs = valorExatoFinal.minus(valorAproximadoFinal).abs();
  const erroRel = valorExatoFinal.equals(0)
    ? new Decimal(0)
    : erroAbs.div(valorAproximadoFinal).abs();

  return {
    valorExatoFinal,
    valorAproximadoFinal,
    erroAbs,
    erroRel,
    passos,
    numeroAjustado: funcaoAjuste(numero, numDigitos),
  };
}

// Notação científica igual ao Python
function formatCientificaBonita(valor?: Decimal, numDigitos?: number): string {
  if (!valor || valor.isZero()) return "0";
  const dig =
    typeof numDigitos === "number" && numDigitos > 0 ? numDigitos - 1 : 4;
  return valor.toExponential(dig);
}

export default function App() {
  const [modo, setModo] = useState<"1" | "2">("1");
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [numero, setNumero] = useState("");
  const [totalSomas, setTotalSomas] = useState("");
  const [numDigitos, setNumDigitos] = useState("");
  const [operacao, setOperacao] = useState<OperacaoTipo>("+");
  const [metodo, setMetodo] = useState<"Truncamento" | "Arredondamento">(
    "Truncamento"
  );
  const [resultado, setResultado] = useState<any>(null);

  const substituirVirgula = (text: string) => text.replace(",", ".");

  const calcular = () => {
    try {
      const digitos = parseInt(numDigitos);
      if (!digitos || digitos <= 0) throw "digitos";
      if (modo === "1") {
        const res = calcularOperacaoUnica(x, y, operacao, digitos, metodo);
        setResultado(res);
      } else {
        const total = parseInt(totalSomas);
        if (!total || total <= 0) throw "totalSomas";
        const res = simularSomasSequenciais(numero, total, digitos, metodo);
        setResultado(res);
      }
    } catch (e) {
      Alert.alert(
        "Erro",
        "Verifique os números digitados. Use ponto (.) como separador decimal."
      );
    }
  };

  const trocarModo = (novoModo: "1" | "2") => {
    setModo(novoModo);
    setResultado(null);
  };

  const botaoEstilo = (ativo: boolean): StyleProp<ViewStyle> => ({
    flex: 1,
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 10,
    backgroundColor: ativo ? "#1e90ff" : "#a0a0a0",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#eef2f5" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Simulador de Erros Numéricos</Text>

        <View style={styles.switchContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={botaoEstilo(modo === "1")}
            onPress={() => trocarModo("1")}
          >
            <Text style={styles.botaoTexto}>Operação Única</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={botaoEstilo(modo === "2")}
            onPress={() => trocarModo("2")}
          >
            <Text style={styles.botaoTexto}>Somas Sequenciais</Text>
          </TouchableOpacity>
        </View>

        {modo === "1" ? (
          <View style={styles.card}>
            <Text style={styles.label}>Número X:</Text>
            <TextInput
              style={styles.input}
              value={x}
              onChangeText={(t) => setX(substituirVirgula(t))}
              keyboardType="decimal-pad"
            />
            <Text style={styles.label}>Número Y:</Text>
            <TextInput
              style={styles.input}
              value={y}
              onChangeText={(t) => setY(substituirVirgula(t))}
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Operação:</Text>
            <View style={styles.switchContainer}>
              {["+", "-", "*", "/"].map((op) => (
                <TouchableOpacity
                  key={op}
                  activeOpacity={0.7}
                  style={botaoEstilo(operacao === op)}
                  onPress={() => setOperacao(op as OperacaoTipo)}
                >
                  <Text style={styles.botaoTexto}>{op}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Método:</Text>
            <View style={styles.switchContainer}>
              {["Truncamento", "Arredondamento"].map((m) => (
                <TouchableOpacity
                  key={m}
                  activeOpacity={0.7}
                  style={botaoEstilo(metodo === m)}
                  onPress={() =>
                    setMetodo(m as "Truncamento" | "Arredondamento")
                  }
                >
                  <Text style={styles.botaoTexto}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Dígitos significativos:</Text>
            <TextInput
              style={styles.input}
              value={numDigitos}
              onChangeText={setNumDigitos}
              keyboardType="number-pad"
            />
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.label}>Número a somar:</Text>
            <TextInput
              style={styles.input}
              value={numero}
              onChangeText={(t) => setNumero(substituirVirgula(t))}
              keyboardType="decimal-pad"
            />
            <Text style={styles.label}>Total de somas:</Text>
            <TextInput
              style={styles.input}
              value={totalSomas}
              onChangeText={setTotalSomas}
              keyboardType="number-pad"
            />
            <Text style={styles.label}>Dígitos significativos:</Text>
            <TextInput
              style={styles.input}
              value={numDigitos}
              onChangeText={setNumDigitos}
              keyboardType="number-pad"
            />
            <Text style={styles.label}>Método:</Text>
            <View style={styles.switchContainer}>
              {["Truncamento", "Arredondamento"].map((m) => (
                <TouchableOpacity
                  key={m}
                  activeOpacity={0.7}
                  style={botaoEstilo(metodo === m)}
                  onPress={() =>
                    setMetodo(m as "Truncamento" | "Arredondamento")
                  }
                >
                  <Text style={styles.botaoTexto}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.botaoCalcular}
          onPress={calcular}
        >
          <Text style={styles.botaoTexto}>Calcular</Text>
        </TouchableOpacity>

        {/* Resultados Operação Única */}
        {resultado && modo === "1" && (
          <View style={styles.resultado}>
            <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
              --- Resultados da Operação Única ---
            </Text>
            <Text>Valor Exato: {resultado.valorExato.toString()}</Text>
            <Text>
              Valor Aproximado: {resultado.valorAproximado.toString()}
            </Text>
            <Text>
              (Notação Científica:{" "}
              {formatCientificaBonita(
                resultado.valorAproximado,
                parseInt(numDigitos)
              )}
              )
            </Text>
            <Text>Erro Absoluto: {resultado.erroAbs.toString()}</Text>
            <Text>
              (Notação Científica:{" "}
              {formatCientificaBonita(resultado.erroAbs, parseInt(numDigitos))})
            </Text>
            <Text>
              Erro Relativo: {(resultado.erroRel.toNumber() * 100).toFixed(4)}%
            </Text>
            <View style={{ marginTop: 8 }}>
              <Text style={{ fontWeight: "bold" }}>Valores Ajustados:</Text>
              <Text>X ajustado: {resultado.xAprox.toString()}</Text>
              <Text>Y ajustado: {resultado.yAprox.toString()}</Text>
            </View>
          </View>
        )}

        {/* Resultados Somas Sequenciais */}
        {resultado && modo === "2" && (
          <View style={styles.resultado}>
            <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
              --- Resultados das Somas Sequenciais ---
            </Text>
            <Text>
              Valor Exato Final: {resultado.valorExatoFinal.toString()}
            </Text>
            <Text>
              Valor Aproximado Final:{" "}
              {resultado.valorAproximadoFinal.toString()}
            </Text>
            <Text>
              (Notação Cientifica:{" "}
              {formatCientificaBonita(
                resultado.valorAproximadoFinal,
                parseInt(numDigitos)
              )}
              )
            </Text>
            <Text>Erro Absoluto Final: {resultado.erroAbs.toString()}</Text>
            <Text>
              (Notação Cientifica:{" "}
              {formatCientificaBonita(resultado.erroAbs, parseInt(numDigitos))})
            </Text>
            <Text>
              Erro Relativo Final:{" "}
              {(resultado.erroRel.toNumber() * 100).toFixed(4)}%
            </Text>
            <View style={{ marginTop: 8 }}>
              <Text style={{ fontWeight: "bold" }}>Passos da soma:</Text>
              {resultado.passos.map((p: Decimal, i: number) => (
                <Text key={i}>{`Soma ${
                  i + 1
                }: ${p.toString()} (Notação Cientifica: ${formatCientificaBonita(
                  p,
                  parseInt(numDigitos)
                )})`}</Text>
              ))}
            </View>
            <View style={{ marginTop: 8 }}>
              <Text style={{ fontWeight: "bold" }}>
                Número ajustado a cada soma:{" "}
                {resultado.numeroAjustado.toString()}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#1e3d59",
  },
  card: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  label: { fontWeight: "bold", marginTop: 8, marginBottom: 4, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 8,
  },
  botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  botaoCalcular: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  resultado: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});