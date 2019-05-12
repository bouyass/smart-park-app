import React from 'react'
import { Image,ActivityIndicator,Dimensions,Switch,View , Button,Text, StyleSheet,ImageBackground ,Footer,FooterTab} from 'react-native'
import Geolocation from 'react-native-geolocation-service'
//import StickyHeaderFooterScrollView from 'react-native-sticky-header-footer-scroll-view'
import Dialog from "react-native-dialog"
import { Button as Buttonn } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import MapView from 'react-native-maps'; 
import { Marker,PROVIDER_GOOGLE } from 'react-native-maps';
import Tts from 'react-native-tts';




let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 43.950111;
const LONGITUDE = 4.820760;
const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO; 


//import Icon from 'react-native-vector-icons/'
class Accueil extends React.Component{
   
    

    
    constructor(props){
        super(props);
        this.state = {
            time: new Date().toLocaleString('ar-EG'),
            latitude:0,
            longitude:0,
            error:null,
            switchValue:true,
            dist:0,
            park1:"",
            park2:"",
            park3:"",
            error:"",
            dialogVisible:false,
            dialogVisible1:false,
            loader:false,
            first:0,
            second:0,
            third:0,
            value:"", // modified from here
            region:{
                latitude:LATITUDE,
                longitude:LONGITUDE,
                latitudeDelta:LATITUDE_DELTA,
                longitudeDelta:LONGITUDE_DELTA
            },
            ceri:{
                latitude:43.946270,
                longitude:4.832440,
                latitudeDelta:LATITUDE_DELTA,
                longitudeDelta:LONGITUDE_DELTA
            }
        };
    }
  
    componentDidMount(){
           this.intervalID = setInterval(
              ()=> this.tick(),
              1000
            );

            // retrieve geolocation position 
            navigator.geolocation.getCurrentPosition(
              (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error:null,
                });
            },
            (error) =>  this.setState({ error: error.message }),
            {enableHeightAccuracy: true, timeout:20000, maximumAge: 1000},
            );


            this.watchID = navigator.geolocation.watchPosition(
               (position) => {
                    this.setState({
                        latitude: position.coords.latitude,
                        logtitude:position.coords.longitude
                    });
               }
            );



            
            this.intervalID = setInterval(
                ()=> this.distance(),
                1000
            );




            navigator.geolocation.getCurrentPosition(
               position => {
                   this.setState({
                       region:{
                           latitude:position.coords.latitude,
                           longitude: position.coords.longitude,
                           latitudeDelta: LATITUDE_DELTA,
                           longitudeDelta:LONGITUDE_DELTA
                       }
                   });
               },
               (error) =>  console.log(error.message),
                           {enableHeightAccuracy:true,timeout:20000,maximumAge:1000},
                );

                this.watchID = navigator.geolocation.watchPosition(
                    position => {
                        this.setState({
                            
                           region:{
                               latitude:position.coords.latitude,
                               longitude:position.coords.longitude,
                               latitudeDelta:LATITUDE_DELTA,
                               longitudeDelta:LONGITUDE_DELTA
                           }
                        });
                    }
                );

               // to make sure that tts got initialized   
        Tts.getInitStatus().then(() => {
            Tts.speak("");
        });

        // now we will call a function that will speak some sentence 
        this.intervalID = setInterval(
            () => this.handleSpeech(),
            10000
        )
              
        
    }

    componentWillUnmount(){
        clearInterval(this.intervalID);
        clearWatch(this.watchID);
    }

    tick(){
        this.setState({
            time: new Date().toLocaleString('ar-EG')
        });
    }

    toggleSwitch = (value) => {
        //onValueChange of the switch this function will be called
        this.setState({switchValue: value})
        //state changes according to switch
        //which will result in re-render the text
     }

     distance(){
         lat1 = this.state.latitude;
         lat2 = 43.909395;
         lon1 = this.state.longitude;
         lon2 = 4.889470;
         var km = this.distFunc(lat1,lon1,lat2,lon2);
         console.log(km);
        this.setState({
           dist: "Tu es a "+km+" du CERI"
           
        });
        
        
    }

    handleSpeech = () => {
        Tts.speak(this.state.dist);
    }
    
   

    distFunc(lat1,lon1,lat2,lon2){
        var R = 6371; // km (change this constant to get miles)
        var dLat = (lat2-lat1) * Math.PI / 180;
        var dLon = (lon2-lon1) * Math.PI / 180;
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        if (d>1)  {return Math.round(d)+ "km";  }
        else if (d<=1) { return d*1000+" m";}
        return d;
    }


  
    onPressLearnMore = () => {
       
        var horaire = this.getPlage();
        var day  = this.getDay();
        if (horaire == 0 || day == "samedi" || day == "dimanche"){
             this.setState({
                 dialogVisible1:true
             });
        }else{
        this.setState({
            dialogVisible:true,
            loader:true
        });
        
        return fetch("http://pedago02a.univ-avignon.fr:5000/getData?plage="+horaire+"&day="+day+"")
        .then(response => response.json())
        .then(data  => {
             if (data != null || data != undefined){
            //var obj = JSON.parse(response);
            if (data.description.park1 > data.description.park2){
                if(data.description.park1 > data.description.park3){
                    var first = data.description.park1;
                    if(data.description.park3 > data.description.park2){
                       var second = data.description.park3;
                       var third = data.description.park2;
                    }else{
                        var second = data.description.park2;
                        var third = data.description.park3;
                    }
                }else{
                    var first = data.description.park3;
                    if(data.description.park1 > data.description.park2){
                        var second = data.description.park1;
                        var third = data.description.park2;
                     }else{
                         var second = data.description.park2;
                         var third = data.description.park1;
                     }
                }
            }else{
                if(data.description.park2 > data.description.park3){
                    var first = data.description.park2;
                    if(data.description.park3 > data.description.park1){
                       var second = data.description.park3;
                       var third = data.description.park1;
                    }else{
                        var second = data.description.park1;
                        var third = data.description.park3;
                    }
                }else{
                    var first = data.description.park3;
                    if(data.description.park1 > data.description.park2){
                        var second = data.description.park1;
                        var third = data.description.park2;
                     }else{
                         var second = data.description.park2;
                         var third = data.description.park1;
                     }
                }
            }
            this.setState({
               loader:false, 
               park1: "\n\n\n         1- Parking 1: ",
               park2: "       2- Parking 2: "+second+" %\n\n",
               park3: "       3- Parking 3: "+third+" %",
               value: first+" %\n\n"
              
             });
            }

        })
        .catch((error) =>{
            console.log("error");
            this.setState({
                loader:false, 
                error: "\n\n\n failed to reach the server"
             });
        });
    }
    }

    handleOK = () => {
        this.setState({
           park1:"",
           park2:"",
           park:"",
           dialogVisible:false,
           dialogVisible1:false
        });
    }

    update = () =>{
        this.setState({
            loader:false, 
            park1: "Parking 1: "+first+" %",
            park2: "Parking 2: "+second+" %",
            park3: "Parking 3: "+third+" %",
           
          });
    }

    getPlage = () => {
        var d = new Date();
        var hours = d.getHours();
        if (hours >= 8 && hours < 10){
            return 1;
        }else if(hours >=10 && hours < 13){
            return 2;
        }else if( hours >=13 && hours < 16){
            return 3;
        }else{
            return 0;
        }
    }

    getDay = () => {
       var d = new Date();
       var day = d.getDay();
       switch(day){
           case 0:
           return "dimanche";
           break;
           case 1:
           return "lundi";
           break;
           case 2:
           return "mardi";
           break;
           case 3:
           return "mercredi";
           break;
           case 4:
           return "jeudi";
           break;
           case 5:
           return "vendredi";
           break;
           case 6:
           return "samedi";
           break;
           

       }
        
    }

 
    

    render(){
       
       

        return(
            <View style={styles.container}>
             
            <View style={styles.body}>
              <View style={[styles.header,{height:50}]}>
                <Text style={[styles.titre,{marginTop:12,color:'white'}]}>Smart Park Application</Text>
               </View>
               <View style={[styles.fsection,{marginTop:-40,width:400,height:200,marginLeft:-20}]}>
                <Text style={styles.textIndic}>This application aims to help CERI students to know in wich park they have more chances 
                    to find pak place, by checking the availability of the all the ceri's parks.
                </Text>
                </View>
                <View style={{ marginTop:-100 }}>
                <Text style={[styles.dateTime,{fontSize:30}]}>
                        { this.state.time }  
                </Text>
                </View>
                <View style={styless.container} >
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styless.map}
                showsUserLocation={true}
                showsMyLocationButton={true}
                showsTraffic={true}
                showsScale={true}
                initialRegion={ this.state.region }
                followsUserLocation={true}
                onRegionChange={ region=>this.setState({region})}
               >
             
               <MapView.Marker
                coordinate={{
                     latitude: this.state.latitude,
                     longitude: this.state.longitude
                }}
                >
                <Image source={require('/home/lyes/Documents/smartpark/images/car.png')}  style={{ width: 50, height: 50 }}  />
                </MapView.Marker>
                 
                 <MapView.Marker
                coordinate={ this.state.ceri }
                
                />
                </MapView>
                </View>
               <View style={[styles.but,{position:'absolute',height:270,width:300,marginLeft:30,marginTop:510}]}>
                <Button style={[styles.button,{height:250}]} 
                   onPress={this.onPressLearnMore}
                   title="Check availability for now"
                   color="#343a40"
                   icon={{ name: 'home' }}
                   accessibilityLabel="Learn more about this purple button"
                />

               </View>
          
         

                
            
   
              <Dialog.Container visible={this.state.dialogVisible}>
                 <Dialog.Title>Résultats</Dialog.Title>
                 <ActivityIndicator size="large" color="#109029" animating={this.state.loader} />
                 <Dialog.Description >
                   probabilités de disponibilité Pour chaque parking exprimée en pourcentage
                         
                   
                         <Text style={[styles.park1,{fontSize:23}]}>  { this.state.park1 } </Text><Text style={[styles.value,{fontSize:23,color:'red'}]}> {this.state.value} </Text>
                         <Text style={[styles.park1,{fontSize:23}]}>  { this.state.park2 } </Text>
                         <Text style={[styles.park1,{fontSize:23}]}>  { this.state.park3 } </Text>
                         <Text style={styles.error}> { this.state.error }  </Text>
                      
                 </Dialog.Description>
                 <Dialog.Button label="OK" onPress={this.handleOK} />

              </Dialog.Container>
            </View>


            <View>
              <Dialog.Container visible={this.state.dialogVisible1}>
                 <Dialog.Title>Résultats</Dialog.Title>
                 <ActivityIndicator size="large" color="#109029" animating={this.state.loader} />
                 <Dialog.Description> 
                         Les parking sont pleinement disponible en ce moment
                 </Dialog.Description>
                 <Dialog.Button label="OK" onPress={this.handleOK} />

              </Dialog.Container>
            </View>
          
            <View style={[styles.footer,{height:50}]}>
              <Text style={[styles.footerTitle,{fontSize:30,color:'white',marginTop:10}]}>
                 { this.state.dist }
              </Text>
             </View>
 

          </View>
                
        ) 
    }
}


const styles = {
    titre:{
        fontSize:25,
       
        textAlign: 'center',
       
 
    },
    header: {
        heigh:150,
        backgroundColor: '#17a2b8',
        color:'white',
        
    },
    backgroundImage: {
        width: '100%',
        heigh: '100%'
    },
    textIndic:{
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        width: '80%',
        height: '35%',
        marginTop:55,
        marginLeft: '10%',
        fontSize:15,
        color:'#221B27'
       
    },
    dateTime:{
        fontSize:20,
        fontWeight:"bold",
        textAlign:"center",
        marginTop:30
    },
    footer:{
        justiftcontent: 'center',
        alignItems: 'center',
        height:50,
        backgroundColor: '#17a2b8',
        fontSize:100,
        color:'white'
        
      
    },
    body:{
      flex:1
    },
    container:{
       flex:1
    },
    section:{
        width:200,
        height:200,
        marginLeft:100,
       

    },
    sectionTitle:{
        textAlign:'center'
    },
    button:{
      
      color:'red',
      height:150
    },
    button1:{
      paddingTop:20
    },
    container: {
        flex: 1,
        justifyContent: 'center'
      },
      horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
      },
      error:{
         fontFamily: 'Cochin',
         fontWeight: 'bold',
         fontSize: 25
      },
      park1:{
         marginLeft: 130,
         textAlign:'center'
      }, 
      mainView:{
          marginLeft:100,
          fontWeight: 'bold',
          fontSize: 30
      },
     
}

const styless = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        marginTop:180,
        height: 300,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      map: {
        ...StyleSheet.absoluteFillObject,
      },
});

export default Accueil