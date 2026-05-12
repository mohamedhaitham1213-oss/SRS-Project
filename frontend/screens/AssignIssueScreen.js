import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

const AssignIssueScreen = () => {
  const [issueId, setIssueId] = useState("");
  const [workerId, setWorkerId] = useState("");
  const [status, setStatus] = useState("");

  // ✅ Assign Issue
  const assignIssue = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/issues/${issueId}/assign`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ workerId }),
        }
      );

      const data = await response.json();
      Alert.alert("Success", data.message);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // ✅ Update Status
  const updateStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/issues/${issueId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();
      Alert.alert("Success", data.message);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // ✅ Close Issue
  const closeIssue = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/issues/${issueId}/close`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();
      Alert.alert("Success", data.message);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Facility Manager Panel</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Issue ID"
        value={issueId}
        onChangeText={setIssueId}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Worker ID"
        value={workerId}
        onChangeText={setWorkerId}
      />

      <Button title="Assign Issue" onPress={assignIssue} />

      <View style={styles.space} />

      <TextInput
        style={styles.input}
        placeholder="Update Status (Pending / In Progress / Resolved)"
        value={status}
        onChangeText={setStatus}
      />

      <Button title="Update Status" onPress={updateStatus} />

      <View style={styles.space} />

      <Button title="Close Issue" color="red" onPress={closeIssue} />
    </ScrollView>
  );
};

export default AssignIssueScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  space: {
    height: 15,
  },
});