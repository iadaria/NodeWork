/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import io from 'socket.io-client';

const App: () => React$Node = () => {
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [socketIO, setSocketIO] = useState(null);
  let _messages = [];

  useEffect(() => {
    const socket = io("http://192.168.1.63:3000");
    socket.on("chat message", msg => {
      console.log('in', msg);
      const messages = [...chatMessages, msg];
      console.log('_messages', _messages);
      _messages = [..._messages, msg];
      setChatMessages(_messages);
      console.log(messages);
    });
    setSocketIO(socket);
  }, []);

  function submitChatMessage() {
    socketIO.emit("chat message", chatMessage);
    setChatMessage("");
  }

  const chatMessagesList = chatMessages.map( 
    (message, index) => <Text key={index}>{message}</Text>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>

          <View style={styles.body}>
            <TextInput 
              style={{ height: 40, borderWidth: 2}}
              autoCorrect={false}
              value={chatMessage}
              onSubmitEditing={() => submitChatMessage()}
              onChangeText={chatMessage => {
                setChatMessage(chatMessage);
              }}
            />

            {chatMessagesList}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
  }
});

export default App;
