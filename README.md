# react-native-firestack-google-signin-hints

Google Sign in with Firebase

https://github.com/fullstackreact/react-native-firestack
https://github.com/devfd/react-native-google-signin

17/11/2016
As both modules are a work in progress, this example worked for me.
You may notice that I did not use "firestack.auth.listenForAuth" to listen to the auth changes.
Well, I found that slow and kind of out of sync.

This pull request:
https://github.com/fullstackreact/react-native-firestack/pull/132

fixed few things and the "signInWithProvider" is now responding with the correct user object.

Anyway, for future reference...
