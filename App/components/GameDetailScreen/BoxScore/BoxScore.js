import React, { Component } from 'react'
import { Text, View, StyleSheet, Button, FlatList, ScrollView, Platform } from 'react-native'
import { connect } from 'react-redux'
import PlayerBoxCell from './PlayerBoxCell'
import Loader from '../../common/Loader'
import NBA from '../../../utils/nba'

const headers = ['Player', 'Pos', 'Min', 'Pts', 'Ast', 'Reb', 'Stl', 'Blk', '+/-', 'FGM', 'FGA', 'FG%', '3PM', '3PA', '3P%', 'FTM', 'FTA', 'FT%', 'OREB', 'DREB', 'TOV', 'PF']

class BoxScore extends Component<Props> {

  static navigationOptions = ({ navigation }) => ({
    headerTitle: `${navigation.state.params.title}`
  })

  constructor() {
    super()

    this.nba = new NBA()
    this.state = {
      loading: true,
      boxscore: {},
      homeTeamStats: [],
      awayTeamStats: [],
      homeTeam: null,
      awayTeam: null,
      activeTeam: 'away'
    }
  }

  componentDidMount() {
    this.fetchBoxscore()
  }

  fetchBoxscore() {
    this.nba.getBoxscore(this.props.gameID, this.props.date)
    .then((data) => {
      const homePlayers = ''
      const awayPlayers = ''
      this.setState({
        loading: false,
        boxscore: data.stats ? data.stats : {},
      })
    })
  }

  _selectTeam(team) {
    this.setState({
      activeTeam: team
    })
  }

  _createBoxscoreTable(stats) {
    let players = stats.activePlayers
    players.unshift(headers) // make the headers the first element
    if (players[0] === players[1] && players[0].personId === undefined && players[1].personId === undefined) {
      players.shift() // if we already have the headers as the first element, there will be a duplicate array of headers added. in that case one of the copies should be removed
    }

    const teamToShowID = this.state.activeTeam === 'away' ? this.props.awayTeamID : this.props.homeTeamID
    const playersToShow = players.filter((player) => {
      return player.personId === undefined || player.teamId === teamToShowID // include header array and players for specified team
    })

    const updatedPlayers = []
    const playersInLeague = this.props.playersInLeague

      // modifying original array; playersToShow
    playersToShow.forEach((player, index, arr) => {
      // skip header
      if (index != 0) {
        const desiredPlayer = playersInLeague.filter((somePlayer, index) => {
          return somePlayer.personId === player.personId
        })

        const newPlayerData = {
          display_fi_last: desiredPlayer[0].firstName.charAt(0) + '. ' + desiredPlayer[0].lastName
        }

        player = {...player, ...newPlayerData}
        // arr[index] = player
        updatedPlayers.push(player)
      } else {
        updatedPlayers.push(player)
      }
    })

    return (
      <FlatList
        data={updatedPlayers}
        renderItem={(player) => (
          <PlayerBoxCell
            key={player.personId}
            player={player}
          />
        )}
      />
    )
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111111' }}>
        {
          this.props.awayTeam && this.props.homeTeam &&
          <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <View style={styles.teams}>
              <View style={styles.teamsButtons}>
                <View style={[ styles.awayButton, this.state.activeTeam === 'away' ? styles.active : styles.inactive ]}>
                  <Button
                    title={this.props.awayTeam.abbreviation}
                    color={Platform.OS === 'ios' ? "#D3D3D3" : "#151516"}
                    onPress={() => { this._selectTeam('away') }}
                  />
                </View>
                <View style={[ styles.homeButton, this.state.activeTeam === 'home' ? styles.active : styles.inactive ]}>
                  <Button
                    title={this.props.homeTeam.abbreviation}
                    color={Platform.OS === 'ios' ? "#D3D3D3" : "#151516"}
                    onPress={() => { this._selectTeam('home') }}
                  />
                </View>
              </View>
            </View>
          </View>
        }
        <View style={styles.boxscore}>
          {
            this.state.loading &&
            <Loader />
          }
          {
            !this.state.loading && this.state.boxscore.activePlayers && this.props.playersInLeague &&
              this._createBoxscoreTable(this.state.boxscore)
          }
          {
            !this.state.loading && !this.state.boxscore.activePlayers &&
              <Text style={{ textAlign: 'center', color: '#D3D3D3' }}> Boxscore available after tip off </Text>
          }
        </View>

      </View>

    )
  }
}

const styles = StyleSheet.create({
  teams: {
    flex: 1
  },
  teamsButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  awayButton: {
    flex: 1,
    backgroundColor: '#111111' // hack to hide space between tab navigator and team buttons
    // backgroundColor: '#151516'
  },
  homeButton: {
    flex: 1,
    backgroundColor: '#111111'
    // backgroundColor: '#151516'
  },
  active: {
    borderBottomWidth: 1,
    borderBottomColor: '#F7971E'
  },
  inactive: {

  },
  boxscore: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

function mapStateToProps(state) {
  return {
    gameID: state.scores.selectedGame.gameID,
    date: state.date.date,
    season: state.date.season,
    homeTeamID: state.scores.selectedGame.homeTeam.teamID,
    awayTeamID: state.scores.selectedGame.awayTeam.teamID,
    homeTeam: state.scores.selectedGame.homeTeam,
    awayTeam: state.scores.selectedGame.awayTeam,
    playersInLeague: state.league.playersInLeague
  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BoxScore)

