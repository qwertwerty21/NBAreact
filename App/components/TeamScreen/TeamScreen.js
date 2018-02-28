import React, { Component } from 'react'
import { Text, View, StyleSheet, ActivityIndicator, Image } from 'react-native'
import { connect } from 'react-redux'
import NBA from '../../utils/nba'
import TeamMap from '../../utils/TeamMap'

class TeamScreen extends Component<Props> {

  constructor() {
    super()

    this.nba = new NBA()
    this.state = {
      loading: true,
      teamInfo: null,
      teamSeasonRanks: null
    }
  }

  componentDidMount() {
    this.fetchTeam()
  }

  _getTeamFromTeamMap(teamID) {
    const team = Object.keys(TeamMap).find((x) => {
      return TeamMap[x].id == teamID
    })
    return TeamMap[team]
  }

  _getRank(number) {
    switch (parseInt(number)){
      case 1:
        return '1st'
      case 2:
        return '2nd'
      case 3:
        return '3rd'
      default:
        return number + 'th'
    }
  }

  fetchTeam() {
    const info = {
      season: this.props.season,
      teamID: this.props.teamID
    }

    // Promise.all([
    //   this.nba.getTeam(info),
    //   this.nba.getRoster(info) // season has to be 2017-18
    // ])
    this.nba.getTeam(info)
    .then((data) => {
      console.log(data)
      this.setState({
        loading: false,
        teamInfo: data.TeamInfoCommon[0],
        teamSeasonRanks: data.TeamSeasonRanks[0]
      })
    })
  }

  render() {
    console.log(this.state)
    return (
      <View style={{ flex: 1, backgroundColor: '#111111' }}>
        {
          this.state.loading &&
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator
                size="large"
                color="#F7971E"
              />
            </View>
        }
        {
          this.state.teamInfo && this.state.teamSeasonRanks ?
            <View style={styles.header}>
              <View style={{ flex: 2, flexDirection: 'row' }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    style={styles.logo}
                    source={this._getTeamFromTeamMap(this.props.teamID).logo}
                  />
                </View>
                <View style={{ flex: 2, flexDirection: 'column' }}>
                  <View  style={{ flex: 1 }}>
                    <Text style={styles.textPrimary}> {this.state.teamInfo.team_city} {this.state.teamInfo.team_name} </Text>
                  </View>
                  <View  style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.textSecondary}> Wins-{this.state.teamInfo.w} </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.textSecondary}> Losses-{this.state.teamInfo.l} </Text>
                    </View>
                  </View>
                  <View  style={{ flex: 1 }}>
                    <Text style={styles.textThird}> {this._getRank(this.state.teamInfo.conf_rank)} in the {this.state.teamInfo.team_conference} </Text>
                    <Text style={styles.textThird}> {this._getRank(this.state.teamInfo.div_rank)} in the {this.state.teamInfo.team_division} </Text>
                  </View>
                </View>
              </View>
              <View style={styles.teamRanks}>
                <View style={styles.teamRankCell}>
                  <Text style={styles.textPrimary}> PPG </Text>
                  <Text style={styles.textSecondary}> {this.state.teamSeasonRanks.pts_pg} </Text>
                  <Text style={styles.textThird}> ({this._getRank(this.state.teamSeasonRanks.pts_rank)}) </Text>
                </View>
                <View style={styles.teamRankCell}>
                  <Text style={styles.textPrimary}> OPPG </Text>
                  <Text style={styles.textSecondary}> {this.state.teamSeasonRanks.opp_pts_pg} </Text>
                  <Text style={styles.textThird}> ({this._getRank(this.state.teamSeasonRanks.opp_pts_rank)}) </Text>
                </View>
                <View style={styles.teamRankCell}>
                  <Text style={styles.textPrimary}> RPG </Text>
                  <Text style={styles.textSecondary}> {this.state.teamSeasonRanks.reb_pg} </Text>
                  <Text style={styles.textThird}> ({this._getRank(this.state.teamSeasonRanks.reb_rank)}) </Text>
                </View>
                <View style={styles.teamRankCell}>
                  <Text style={styles.textPrimary}> APG </Text>
                  <Text style={styles.textSecondary}> {this.state.teamSeasonRanks.ast_pg} </Text>
                  <Text style={styles.textThird}> ({this._getRank(this.state.teamSeasonRanks.ast_rank)}) </Text>
                </View>
              </View>
            </View>
          :
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.text}> Error </Text>
            </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    color: '#D3D3D3'
  },
  textPrimary: {
    color: '#D3D3D3',
    fontSize: 22
  },
  textSecondary: {
    color: '#D3D3D3',
    fontSize: 18
  },
  textThird: {
    color: '#D3D3D3',
    fontSize: 14
  },
  header: {
    height: 260,
    backgroundColor: '#171717',
    flexDirection: 'column'
  },
  teamRanks: {
    flex: 1,
    flexDirection: 'row'
  },
  teamRankCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    height: 90,
    width: 90,
  }
})

function mapStateToProps(state) {
  return {
    season: state.date.season,
    teamID: state.scores.selectedTeam.teamID
  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamScreen)