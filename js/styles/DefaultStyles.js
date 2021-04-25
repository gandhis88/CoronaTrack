import styled from 'styled-components'
import { Button, 
        Text, 
        View, 
        TouchableOpacity,
        Animated,
        Image,
        TextInput,
        KeyboardAvoidingView,
        Picker } from 'react-native';
 
import { Divider, Icon, Layout} from '@ui-kitten/components';

export const StatsFlexView = styled.View`
     border-radius: 10px;
    box-shadow: ${props => (props.active === true) ? ' 0px 24px 24px rgba(0, 0, 0, 0.25)' : '0px 4px 4px rgba(0, 0, 0, .15)'}
      display:flex;
    flex-direction:column;
    justify-content: ${(props) => props.justifyContent ? props.justifyContent: 'flex-start'};
    align-items: center;
`

export const ModInputTF = styled.TextInput `
     width: 90%;
    height: 51px;
    background: ${props => (props.active === true)? '#FFF': '#fff'};
    border-radius: 10px;
    ${'' /* padding-left: 45px; */}
    color:#000;
    padding-left:20px;
    ${'' /* border: ${props => (props.active) ? '1px solid #E1DDDD': 'none'}; */}
    font-size:16px;
    text-align:left;
    ${'' /* box-shadow: 0px 14px 34px rgba(0, 0, 0, 0.45); */}
    box-shadow: ${props => (props.active === true) ? ' 0px 24px 24px rgba(0, 0, 0, 0.25)' : '0px 4px 4px rgba(0, 0, 0, .15)'}
`



export const FInputTF = styled.TextInput `
     width: 90%;
    height: 120px;
    background: ${props => (props.active === true)? '#FFF': '#fff'};
    border-radius: 10px;
    ${'' /* padding-left: 45px; */}
    color:#000;
    padding:20px;
    ${'' /* border: ${props => (props.active) ? '1px solid #E1DDDD': 'none'}; */}
    font-size:16px;
    margin-bottom:10%;
margin-top:10%;
    text-align:left;
    ${'' /* box-shadow: 0px 14px 34px rgba(0, 0, 0, 0.45); */}
    box-shadow: ${props => (props.active === true) ? ' 0px 24px 24px rgba(0, 0, 0, 0.25)' : '0px 4px 4px rgba(0, 0, 0, .15)'}
`

export const SearchBarTouch = styled.TouchableOpacity`
     width: 90%;
    height: 55px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
   
    font-family: 'Roboto';
    border-radius: 10px;
    box-shadow: 0px 14px 24px rgba(0, 0, 0, 0.25);
`

export const ContentElement = styled.View`
   
    width: 92%;
    /* Rectangle: */
    padding:15px ;
    background: #E5E5E5;
    border: 1px solid #D6D6D6;
    box-shadow: 2px 33px 13px rgba(175,175,175,0.19);
    border-radius: 14px;
    margin-top:20px;

`




export const ContentElementWarning = styled.View`
   
    width:100%;
    /* Rectangle: */
    padding:10px;
    background: #E12727;
    box-shadow: 0px 5px 8px rgba(237,93,93,0.47);
    border-radius: 12px;
    margin-top:20px;

`

export const FlexRow = styled.View`
     display: flex;
    flex-direction:row;
    justify-content: space-between;
    align-items: center;
`

 export const MainContainer = styled.View`
    flex: 1;
    justify-content: ${(props) => props.justifyContent ? props.justifyContent: 'flex-start'};
    align-items: center;
    width: 100%;
    background: #fff;
`;


export const InlineFlex = styled.View`
    display: flex;
    flex-direction:row;
    justify-content: space-around;
    align-items: center;
    width: 85%;
    padding-top:20px;
`

export const ModFlexView = styled.View`
     display:flex;
    flex-direction:column;
    justify-content: ${(props) => props.justifyContent ? props.justifyContent: 'flex-start'};
    align-items: center;
    width:100%;
`

export const FlexView = styled.View`
    flex:1;
    flex-direction:column;
    justify-content: ${(props) => props.justifyContent ? props.justifyContent: 'flex-start'};
    align-items: center;
    width:100%;
    
`

export const FooterView = styled.View `
    width: 100%;
    display: flex;
    margin-right: auto;
    margin-left:auto;
    flex-direction: column;
    justify-content:flex-start;
    align-items: center;
    height: auto;
   

`      
export const LogoContainer = styled.View`
    display: flex;
    flex-direction: column;
    position: absolute;
    width:40%;
    top:5%;
    justify-content: flex-start;
    align-items: center;
`;

export const ButtonContainer = styled.View`
    position: absolute;
    bottom: 5;
    width: 90%;
    justify-content:${(props) => props.justifyContent ? props.justifyContent: 'flex-end'};
    align-items: center;
    display:flex;
    flex-direction:column;
    height:25%;
    padding-bottom:20px;
`;


export const LogoImage = styled.Image`
    flex: 1;
    width: 100%;
    resize-mode: contain;
`;

export const GreyText = styled.Text`
    width: 80%;
    color:#323232;
    font-size: ${props => (props.size) ? props.size : '20px'};
    text-align: ${props => (props.align) ? props.align : 'left'};
`;


export const DarkText = styled.Text`
    width: 100%;
    color:#323232;
    font-weight:${props => (props.weight) ? props.weight : 200};
    font-size: ${props => (props.size) ? props.size : '22px'};
    text-align: ${props => (props.align) ? props.align : 'left'};
`;




export const ProfilePictureUploadView = styled.TouchableOpacity`
    background-color: #f9f9f9;
    border-radius: 100px;
    width: 90px;
    overflow:hidden;
    height: 90px;
    
`

export const ProfilePictureImage = styled.Image`
    flex: 1;
    width:100%;
    resize-mode: cover;
`


export const ProfilePictureView = styled.View`
      background-color: #f9f9f9;
    border-radius: 200px;
    width: 150px;
    overflow:hidden;
    height: 90px;
    
`

export const TextDefault = styled.Text`
    font-size: ${props => props.size ? props.size: '16px'};
    font-family: 'Roboto-Medium';
    font-weight: ${props => props.weight ? props.weight: 400};
    color: ${props => props.color? props.color: '#000'};
    text-align:${props => props.align ? props.align : 'left'};
`

export const SplashContent = styled.View`
    position:absolute;
    top: 30%;
    width: 100%;
    display: flex;
     flex-direction: column;
    justify-content: center;
    align-items: center;
`



export const ButtonPrimary = styled.TouchableOpacity`
    width: 100%;
    height: 55px;
    background-color: ${props => (props.disabledStyle === true) ? '#E12727': '#E12727'};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-family: 'Roboto';
    border-radius: 10px;
    opacity:${props => (props.disabledStyle === true) ? '0.5': '1'}; 



`;



export const ModRadioButtonDarkGrey = styled.TouchableOpacity`
    width: 20%;
    height: 35px;
    background-color: ${props => (props.activeStyle === true) ? '#E12727': '#282828'};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    padding:5px;
    margin-left:10px;
    font-family: 'Roboto';
    border-radius: 7px;
    opacity:${props => (props.disabledStyle === true) ? '0.5': '1'}; 

`;

export const RadioButtonDarkGrey = styled.TouchableOpacity`
    width: 30%;
    height: 55px;
    background-color: ${props => (props.activeStyle === true) ? '#E12727': '#282828'};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-family: 'Roboto';
    border-radius: 15px;
    opacity:${props => (props.disabledStyle === true) ? '0.5': '1'}; 



`;


export const ButtonDarkGrey = styled.TouchableOpacity`
   width: 100%;
    height: 55px;
    background-color: #282828;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    position:relative;
    margin-bottom:20px;
    margin-top:10px;
    font-family: 'Roboto';
    border-radius: 10px;
    box-shadow: 0px 14px 24px rgba(0, 0, 0, 0.25);

    
`;
export const ButtonBlack = styled.TouchableOpacity`
   width: 100%;
    height: 55px;
    background-color: ${props => props.disabled ? '#a9a9a9': '#000' };
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
 
    font-family: 'Roboto';
    border-radius: 10px;
    box-shadow: 0px 14px 24px rgba(0, 0, 0, 0.25);

    
`;

export const ButtonWhite = styled.TouchableOpacity`
   width: 100%;
    height: 40px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
 
    font-family: 'Roboto';
    border-radius: 10px;
    box-shadow: 0px 14px 24px rgba(0, 0, 0, 0.25);

    
`;

export const ButtonTransparent = styled.TouchableOpacity`
     width: 100%;
    height: 55px;
    background-color: ${props => (props.disabledStyle === true) ? DISABLED_COLOR: 'transparent'};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-family: 'Roboto';
    border-radius: 10px;
    opacity:${props => (props.disabledStyle === true) ? '0.5': '1'}; 
   ${'' /* box-shadow:${props => (props.disabledStyle === true) ? 'none': '0px 7px 13px rgba(7, 136, 255, 0.41)'};  */}
`






export const NavbarDefault = styled.View `
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
    height: 80px;
    padding-top:40px;
    background: #fff;
`


export const NavButton =  styled.TouchableOpacity `
    padding-left: 30px;

`

export const NavButtonRight =  styled.TouchableOpacity `
    padding-right: 30px;

`


export const NavButtonImage = styled.Image `
    flex: 1;
    width: ${props => props.size ? props.size: '30px' };
    resize-mode: contain;

`



export const NavTitle = styled.Text `
    font-family: 'Roboto';
    font-size: 16px;
    color: ${props => props.color ? props.color: '#000'}
`

export const NavSub = styled.Text`
    font-size: 10px;
    font-family: 'Roboto';
    color:#000;
`

export const NavTitleView = styled.View `
    flex:1;
    justify-content:center;
    flex-direction:column;
    align-items:center;
    margin-right: 30px;

`



export const ImageSelectorTouchable = styled.TouchableOpacity`
    height: 150px;
    width: 150px;
    border-radius: 40px;
    background-color:#f9f9f9;
    margin-top:80px;
`





export const InputTF = styled.TextInput `
     width: 40%;
    height: 51px;
    background: ${props => (props.active === true)? '#F2F2F2': '#F9F9F9'};
    border-radius: 10px;
    ${'' /* padding-left: 45px; */}
    color:#000;
    border: ${props => (props.active) ? '1px solid #E1DDDD': 'none'};
    font-size:25px;
    margin-top:20px;
    text-align:center;
    ${'' /* box-shadow: ${props => (props.active === true) ? '0px 0px 10px rgba(0, 0, 0, 0.15)' : '0px 0px 0px rgba(0, 0, 0, 0)'} */}
`


export const FormGroup = styled.View `
    width: 90%;
    display: flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    padding-top:20px;
    padding-bottom: 10px;
`

export const DefaultErrorText = styled.Text`
    font-family: 'Roboto';
    color: #ff0000;
    font-size: 14px;
    width:300px;

`

export const LabelText = styled.Text `
     font-size: ${props => props.size ? props.size: '16px'};
    font-family: 'Roboto-Medium';
    font-weight: ${props => props.weight ? props.weight: 400};
    color: ${props => props.color? props.color: '#000'};
    padding:10px;
`