import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
const univasfImage = require("../imagem/univasf.png");


export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={univasfImage} style={styles.logo} />
      <Text style={styles.titulo}>Menu Principal</Text>
      <TouchableOpacity style={styles.botao} onPress={() => router.push("./simulador")}>
        <Text style={styles.botaoTexto}>Abrir Simulador de Erros</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Projeto Avaliativo de Cálculo Numérico</Text>
        <Text style={styles.cardTexto}>Docente: Jorge Cavalcanti</Text>
        <Text style={styles.cardTexto}>Discentes: Adhemar Cavalcanti, Maria Nicolle, Stharley</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 16,
    paddingTop: 80,
    backgroundColor: "#eef2f5"
  },
  logo: { width: 200, height: 100, resizeMode: "contain", marginBottom: 20 },
  titulo: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  botao: { backgroundColor: "#1e90ff", padding: 16, borderRadius: 12 },
  botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  card: {
  width: '90%',
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 16,
  marginTop: 'auto',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  elevation: 4,
  // Remova ou comente a linha abaixo para alinhar à esquerda
  // alignItems: 'center',
},
cardTitulo: {
  fontWeight: 'bold',
  fontSize: 18,
  marginBottom: 8,
  color: '#333',
  textAlign: 'left',  // Alinhamento para a esquerda
},
cardTexto: {
  fontSize: 16,
  marginBottom: 4,
  color: '#555',
  textAlign: 'left',  // Alinhamento para a esquerda
},

});
