import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import { selectGame } from '../../actions/actions'
import TeamMap from '../../utils/TeamMap'

const TeamSection = ({style, team, teamColor, logo, flip}) => (
  <View style={[styles.team, style]}>
    {
      flip &&
      <View style={styles.defaultCenteredView}>
        <Text style={{ fontSize: 22, color: '#D3D3D3' }}> {team.score} </Text>
      </View>
    }
    <View style={styles.defaultCenteredView}>
      <View>
        {/* <Image
          style={styles.logo}
          source={logo}
        /> */}
        <Text style={[styles.text, { fontSize: 22, color: teamColor }]}> {team.triCode} </Text>
      </View>
    </View>
    {
      !flip &&
      <View style={styles.defaultCenteredView}>
        <Text style={{ fontSize: 22, color: '#D3D3D3' }}> {team.score} </Text>
      </View>
    }
  </View>
)

class GameCell extends Component<Props> {

  _selectGame() {
    const gameID = this.props.teams.item.gameId
    const homeTeam = this.props.teams.item.hTeam.triCode
    const awayTeam = this.props.teams.item.vTeam.triCode
    const gameData = {
      gameID: gameID,
      homeTeam: {
        abbreviation: homeTeam,
        teamID: this.props.teams.item.hTeam.teamId
      },
      awayTeam: {
        abbreviation: awayTeam,
        teamID: this.props.teams.item.vTeam.teamId
      }
    }

    this.props.selectGame(gameData)
    this.props.navigator.navigate('Game', { title: `${awayTeam} vs ${homeTeam}`})
  }

  _renderGameStatus() {
    const {
      clock,
      period,
      startTimeEastern
    } = this.props.teams.item

    return (
      clock && period.current != 0 ?
        <View style={styles.gameInfo}>
          <Text style={[ styles.text, {fontSize: 20 }]}> Q{period.current} </Text>
          <Text style={[ styles.text, { fontSize: 16 }]}> {clock} </Text>
        </View>
      :
      this.props.teams.item.endTimeUTC ?
        <View style={styles.gameInfo}>
          <Text style={[ styles.text, {fontSize: 20 }]}> Final </Text>
        </View>
      :
      period.isHalftime ?
        <View style={styles.gameInfo}>
          <Text style={[ styles.text, {fontSize: 20 }]}> Halftime </Text>
        </View>
      :
      <View style={styles.gameInfo}>
        <Text style={[ styles.text, {fontSize: 20 }]}> Tip off </Text>
        <Text style={[ styles.text, { fontSize: 16 }]}> {startTimeEastern} </Text>
      </View>
    )
  }

  render() {

    const {
      hTeam,
      vTeam
    } = this.props.teams.item

    const awayTeamColor = TeamMap[vTeam.triCode.toLowerCase()] ? TeamMap[vTeam.triCode.toLowerCase()].color : '#1C3F80'
    const awayTeamLogo  = TeamMap[vTeam.triCode.toLowerCase()] ? TeamMap[vTeam.triCode.toLowerCase()].logo : require('../../Assets/Images/nba.png')
    const homeTeamColor = TeamMap[hTeam.triCode.toLowerCase()] ? TeamMap[hTeam.triCode.toLowerCase()].color : '#BE0E2C'
    const homeTeamLogo  = TeamMap[hTeam.triCode.toLowerCase()] ? TeamMap[hTeam.triCode.toLowerCase()].logo : require('../../Assets/Images/nba.png')

    return (
      <TouchableOpacity style={{flexDirection: 'column'}} onPress={() => { this._selectGame() }}>
        <View style={styles.colorbar}>
          <View style={{ flex: 1, backgroundColor: awayTeamColor, borderTopLeftRadius: 12 }} />
          <View style={{ flex: 1, backgroundColor: homeTeamColor, borderTopRightRadius: 12 }} />
        </View>
        <View style={styles.gamecell}>
          <TeamSection
            style={styles.awayTeam}
            team={vTeam}
            teamColor={awayTeamColor}
            logo={awayTeamLogo}
            flip={false}
          />
          {
            this._renderGameStatus()
          }
          <TeamSection
            style={styles.homeTeam}
            team={hTeam}
            teamColor={homeTeamColor}
            logo={homeTeamLogo}
            flip={true}
          />
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    color: '#D3D3D3'
  },
  defaultCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  colorbar: {
    marginTop: 12,
    marginLeft: 10,
    marginRight: 10,
    height: 4,
    flexDirection: 'row',
  },
  gamecell: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
    backgroundColor: '#141414',
    // backgroundColor: '#212121',
    flexDirection: 'row',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  team: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  homeTeam: {
    marginRight: 10
  },
  awayTeam: {
    marginLeft: 10
  },
  gameInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  logo: {
    height: 60,
    width: 60,
  }
})

function mapStateToProps(state) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {
    selectGame: (selectedGame) => dispatch(selectGame(selectedGame))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameCell)
