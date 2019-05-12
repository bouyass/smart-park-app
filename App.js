import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Accueil from './components/Accueil.js'
export default class App extends React.Component {
  render() {
    return (
       <Accueil/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
