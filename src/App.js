import React, { Component } from 'react';
import Particles from 'react-particles-js';

import './App.css';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticleJSON from './particlesjs-config.json';
import 'tachyons';



const initialState =
{
  input: '',
  imageUrl: '',
  box: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }


  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }


  calculateFaceLocation = (data) => {
    let faces = [];
    if (data.outputs[0].data.regions !== null) {
      for (let i = 0; i < data.outputs[0].data.regions.length; i++) {
        faces.push(data.outputs[0].data.regions[i].region_info.bounding_box)
      }
    }

    return this.getBoxes(faces);
  }

  getBoxes = (faces) => {
    if (faces.length > 0) {
      console.log('#of faces ' + faces.length);
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      let boxes = [];

      for (var i = 0; i < faces.length; i++) {

        let box = {
          leftCol: faces[i].left_col * width,
          topRow: faces[i].top_row * height,
          rightCol: width - (faces[i].right_col * width),
          bottomRow: height - (faces[i].bottom_row * height)
        }
        boxes.push(box);
      }
      return boxes
    }
  }
  displayFaceBox = (boxes) => {
    console.log(boxes);
    this.setState({ box: boxes });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    if (this.state.imageUrl) {
      fetch('http://localhost:3000/imageurl', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: this.state.input
        })
      })


        .then(response => response.json())
        .then(response => {
          if (response) {
            fetch('http://localhost:3000/image', {
              method: 'put',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: this.state.user.id
              })
            })
              .then(response => response.json())
              .then(count => {
                this.setState(Object.assign(this.state.user, { entries: count }))
              })
              .catch(console.log);

          }
          this.displayFaceBox(this.calculateFaceLocation(response))
        })
        .catch(err => console.log(err));
    }
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)

    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route })
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={ParticleJSON}

        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === 'home'
          ? <div><Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit} />

            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
          : (
            route === 'signin'

              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;


