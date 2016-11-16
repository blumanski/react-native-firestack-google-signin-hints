import React, {Component} from 'react'
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Navigator,
    ActivityIndicator
} from 'react-native'

import Firestack from 'react-native-firestack'
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin'

const FirebaseStack = new Firestack({debug: true})

class myapp extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user: null,
            loading: false
        }
    }

    componentDidMount() {
        this.setupGoogleSignIn();
    }

    // after google signIn is done, this function will run
    firebaseLogin(user) {
        if(user.idToken) {
            FirebaseStack.auth.signInWithProvider('google', user.idToken).then((userFirebase) => {
                  let userData = userFirebase.user
                  if(userData) {
                      userData.googleId = user.id
                  }

                  this.setState({user: userData, loading: false})

                }).catch((error) => {
                  console.log(error)
                 });
        }
    }

    async setupGoogleSignIn() {
        try {
          this.setState({loading: true});

          await GoogleSignin.hasPlayServices({ autoResolve: true });
          await GoogleSignin.configure({
            iosClientId: '409486988658-04julm8idncs3vlqpdboc6a0napgntit.apps.googleusercontent.com',
            webClientId: '409486988658-r57kps5v4kfl2gbvktq6up916oauc8hj.apps.googleusercontent.com',
            offlineAccess: false // if this is true, the user object will not come back with an idToken but Server key token
            // if it is false, the object will come back with a server key = null
          });

          GoogleSignin.currentUserAsync().then((user)=> {
              	if(user && user.idToken) {
                        // log in to firebase
                        this.firebaseLogin(user)
              	} else {
              		this.setState({loading: false});
              	}
              })
              .catch((error) => {
                  console.log(error)
              })
        }

        catch(err) {
          this.setState({loading: false});
          console.log("Google signin error", err.code, err.message);
        }
      }

    signIn = () => {
      	this.setState({loading: true});
        GoogleSignin.signIn()
            .then((user) => {
                if(user && user.idToken) {
                    // log into firebase
                    this.firebaseLogin(user)
              	} else {
                    this.setState({loading: false});
                }
            })
            .catch((err) => {
                console.log('WRONG SIGNIN', err)
            })
            .done();
     }

     signOut() {
         this.setState({loading: true})
         GoogleSignin.revokeAccess()
            .then(() => GoogleSignin.signOut())
            .then(() => {this.setState({user: null, loading: false}) } )
            .done()
        }

        render() {
          	if(this.state.loading) {
          		return (
          			<View>
        	  			<ActivityIndicator
        		        	animating={true}
        		        	style={{height: 80}}
        		        	size="large"
        		      	/>
        		    </View>
        	    );
          	} else {
          		if (!this.state.user) {
        	      return (
        	        <View>
        	        <TouchableOpacity onPress={() => {this.signIn()} } style={{width: 200, height: 44, backgroundColor: '#ccc'}}>
                    <Text>Login</Text>
                  </TouchableOpacity>
        	        </View>
        	      )
        	    }
        	    else {
            	       return (
                           <View>
                               <Text>Hello {this.state.user.displayName} {this.state.user.uid} </Text>
                   	        <TouchableOpacity onPress={() => {this.signOut()} } style={{width: 200, height: 44, backgroundColor: '#ccc'}}>
                               <Text>Logout</Text>
                             </TouchableOpacity>
                   	        </View>

            	      	)
            	    }
          	}
      }
}

module.exports = myapp
