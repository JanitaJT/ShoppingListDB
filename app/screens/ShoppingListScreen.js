import React from "react";
import {
  StyleSheet,
  Text,
  View,
  useState,
  useEffect,
  TextInput,
} from "react-native";
import { SQLite } from "expo-sqlite";

const db = SQLite.openDatabase("shoppinglistdb.db");

export default function ShoppingListScreen() {
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [shoppinglist, setshoppinglist] = useState([]);
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists shoppinglist (id integer primary key not null, product text, amount text);"
      );
    });
    updateList();
  }, []);

  const saveItem = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "insert into shoppinglist (product, amount) values (?, ?);",
          [product, amount]
        );
      },
      null,
      updateList
    );
  };

  const updateList = () => {
    db.transaction((tx) => {
      tx.executeSql("select * from shoppinglist;", [], (_, { rows }) =>
        setshoppinglist(rows.array)
      );
    });
  };

  const deleteItem = (id) => {
    db.transaction(
      (tx) => {
        tx.executeSql("delete from shoppinglist where id = ?;", [id]);
      },
      null,
      updateList
    );
  };

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%",
        }}
      />
    );
  };

  return (
    <View>
      <TextInput
        placeholder="Product"
        onChangeText={(product) => setProduct(product)}
        value={product}
      />
      <TextInput
        placeholder="Amount"
        onChangeText={(amount) => setAmount(amount)}
        value={amount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  listcontainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
  },
});
