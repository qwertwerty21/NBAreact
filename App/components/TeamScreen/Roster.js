import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native'
import { connect } from 'react-redux'
import NBA from '../../utils/nba'
import { selectPlayer } from '../../actions/actions'

class Roster extends Component<Props> {

  constructor() {
    super()

    this.nba = new NBA()
    this._renderPlayer = this._renderPlayer.bind(this)
    this._selectPlayer = this._selectPlayer.bind(this)
  }

  _selectPlayer(player) {
    const selectedPlayer = {
      player: player
    }
    this.props.selectPlayer(selectedPlayer)
    this.props.navigator.navigate('Player')
  }

  _formatPosition(position) {
    switch (position) {
      case 'C-F':
        return 'Center-Forward'
      case 'F-G':
        return 'Forward-Guard'
      case 'G-F':
        return 'Guard-Forward'
      case 'F':
        return 'Forward'
      case 'G':
        return 'Guard'
      case 'C':
        return 'Center'
      default:
        return ''
    }
  }

  _keyExtractor(player){
    return player.player_id.toString()
  }

  _renderPlayer(player) {
    player = player.item
    // const playerImageURL = this.nba.getPlayerImage(player.player_id)
    const playerImageURL = null

    return(
      <TouchableOpacity style={styles.playerCell} onPress={() => this._selectPlayer(player)}>
        {
          playerImageURL &&
          <View style={styles.imageContainer}>
            <Image
              style={styles.playerImage}
              source={{ uri: playerImageURL }}
            />
          </View>
        }
        {/* <View>
          <Text style={styles.textPrimary}> #{player.num} {player.player} </Text>
          <Text style={styles.textSecondary}> {this._formatPosition(player.position)} </Text>
        </View> */}
        {/*  */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.textSecondary}> #{player.num} </Text>
          </View>
          <View style={{ flex: 2 }}>
            <Text style={styles.textSecondary}> {player.player} </Text>
          </View>
          <View style={{ flex: 2 }}>
          <Text style={styles.textSecondary}> {this._formatPosition(player.position)} </Text>
          </View>
        </View>
        {/*  */}
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <FlatList
        // numColumns={2}
        data={this.props.team}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderPlayer}
      />
    )
  }
}

const styles = StyleSheet.create({
  textPrimary: {
    textAlign: 'center',
    color: '#D3D3D3',
    fontSize: 18
  },
  textSecondary: {
    textAlign: 'center',
    color: '#D3D3D3',
    fontSize: 16
  },
  playerCell: {
    flex: 1,
    marginTop: 5,
    height: 45,
    borderBottomColor: '#333333',
    borderBottomWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  playerImage: {
    height: 100,
    width: 100,
    borderRadius: 50
  }
})

function mapStateToProps(state) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {
    selectPlayer: (selectedPlayer) => dispatch(selectPlayer(selectedPlayer))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Roster)
