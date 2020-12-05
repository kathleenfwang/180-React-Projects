import React from "react"
import axios from "axios"
import RecipeCard from "./Components2/day20/RecipeCard"
import { connect } from "react-redux";
import { Fade, Slide, Rotate } from 'react-reveal';
class Day20 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            recipes:null,
            loaded:false, 
            showForm: false, 
            showLoginForm: false,
            name: "", 
            description: "", 
            image: "", 
            username: "", 
            password: "", 
            fakePass: "",
            isLoggedIn: false,
            user: "", 
            buttonmsg: "", 
            defaultMsg: "Must be logged in first to add/move recipes"
        }
        this.proxyurl = "https://cors-anywhere.herokuapp.com/"
        this.recipeUrl =   `${this.proxyurl}${process.env.REACT_APP_RECIPE_URL}`
        this.userUrl =   `${this.proxyurl}${process.env.REACT_APP_USER_URL}`
        this.userLogin = `${this.proxyurl}${process.env.REACT_APP_USER_URL}/login`
    }
    componentDidMount() {
        this.getRecipes()
    }
    getRecipes = () => {
        axios.get(this.recipeUrl)
        .then(res => {
          const recipes = res.data;
          this.setState({ recipes, loaded: true });
        })
    }
    componentDidUpdate(prevProps,prevState) {
        if (prevProps.count !== this.props.count) {
             this.getRecipes()
        }
    }
    getRecipeCardsDone = () => {
        const {recipes, username}  = this.state
        return recipes.map((recipe) => {
            if (recipe.done) return <RecipeCard username = {username} recipe = {recipe} /> 
        }).reverse()
    }
    getRecipeCardsNotDone = () => {
        const {recipes,username}  = this.state
        return recipes.map((recipe) => {
            if (!recipe.done) return <RecipeCard username = {username} recipe = {recipe} /> 
        }).reverse()
    }
   
    addRecipe = (e) => {
        e.preventDefault()
        const { name, description, image } = this.state
        this.setState(prevState => ({
            showForm: !prevState.showForm
        }))
        const recipe = {
            name,
            description,
            image
        }
        if (this.state.showForm) {
            axios.post(this.recipeUrl, recipe)
                .then(res => {
                    let recipe = res.data
                    this.setState((prevState) => ({
                        recipes: [...prevState.recipes, recipe],
                    }));
                }).catch((e) => console.log(e))
        }
        this.setState({
            name: "",
            description: "",
            image: ""
        })
    }
    handleName = (e) => {
        this.setState({ name: e.target.value })
    }
    handleDesc = (e) => {
        this.setState({ description: e.target.value })
    }
    handleImg = (e) => {
        this.setState({ image: e.target.value })
    }
    handleUserName = (e) => {
        this.setState({ username: e.target.value })
    }
    handlePass = (e) => {
        let fakePass = ""
        let value = e.target.value
        for (let i =0;i<value.length;i++) {
            fakePass +="*"
        }
        this.setState({ 
            password: value,
            fakePass: fakePass 
        })
    }
    form = () => {
        const {defaultMsg} = this.state
        if (!this.state.isLoggedIn) {
            return (
                <div className ="warning">{defaultMsg}</div>
            )
        }
        return (
            <form style={{ width: '70%' }} onSubmit={this.addRecipe} className={`form ${this.state.showForm}Form`}>
                <label>Name *</label>
                <input placeholder="Spaghetti" onChange={this.handleName} value={this.state.name}></input>
                <br></br>
                <label>By: </label>
                <input value={this.state.user}></input>
                <br></br>
                <label>Ingredients *</label>
                <textarea placeholder="Marinara sauce, ground beef, pasta noodles, zucchini, basil, mushrooms" onChange={this.handleDesc} value={this.state.description}></textarea>
                <br></br>
                <label>Image URL: *</label>
                <input placeHolder="spaghetti.png" onChange={this.handleImg} value={this.state.image}></input>
                <br></br>
                <button type="submit">Submit</button>
            </form>
        )
    }
    loginForm = () => {
        const {buttonmsg} = this.state
        let placeholderUser = "" 
        let placeholderPass = ""

        if (buttonmsg == "Log In") {
            placeholderUser = "Demo: a"
            placeholderPass = "Demo: 123"
        }
        return (
            <form style={{ width: '70%' }} onSubmit={this.handleLogin} className={`form ${this.state.showLoginForm}Form`}>
                <label>Username *</label>
                <input placeholder={placeholderUser} onChange={this.handleUserName} value={this.state.username}></input>
                <br></br>
                <label>Password *</label>
                <input placeholder={placeholderPass} onChange={this.handlePass} value={this.state.fakePass}></input>
                <br></br>
                <button type="submit">{buttonmsg}</button>
            </form>
        )
    }
    handleLogin = (e,msg) => {
        e.preventDefault()
        const { username,password,showLoginForm,isLoggedIn } = this.state
        // logout 
        if (isLoggedIn) {
            this.setState({
                user: "",
                isLoggedIn: false
            })
        }
        //signup
        else if (msg === "Sign Up") {
            this.setState(prevState => ({
                buttonmsg: msg
            }))
            this.handleNewLogin(e)
        }
        else {

        this.setState(prevState => ({
            showLoginForm: !prevState.showLoginForm, 
            buttonmsg: msg
        }))
        const user = {
            username,
            password
        }
        if (showLoginForm) {
            axios.post(`${this.userUrl}/login`, user)
                .then(res => {
                    let result = res.status
                    console.log(result)
                    if (result == 200) {
                        this.setState(
                            {isLoggedIn:true, user: username
                            })
                    }
                    else {
                        let data = res.data 
                        this.setState({defaultMsg: data})
                    }
                }).catch((e) => console.log(e))
        }
        this.setState({
            username: "",
            password: "",
            fakePass: ""
        })
    }
    }
    handleNewLogin = (e) => {
        e.preventDefault()
        const { username,password } = this.state
        this.setState(prevState => ({
            showLoginForm: !prevState.showLoginForm
        }))
        const user = {
            username,
            password
        }
        if (this.state.showLoginForm) {
            axios.post(this.userLogin, user)
                .then(res => {
                    let result = res.data
                    console.log(result) 
                    this.setState({
                        user: username, 
                        isLoggedIn: true
                    })
                }).catch((e) => console.log(e))
        }
        this.setState({
            username: "", 
            password: "", 
            fakePass: ""
        })
    }
    getNav = () => {
        const {isLoggedIn, user} = this.state
        return(
        <nav className ="alignCenter">
            <div className ="flex">
            <li> <h1>Recipe Library </h1></li>
            <li> <button onClick={this.addRecipe}>Add Recipe </button></li>
            <li><button onClick = {(e) => this.handleLogin(e,"Log In")}>{isLoggedIn? "Logout" : "Login"}</button></li>
            <li>{this.form()}</li>
            <li>{this.loginForm()}</li>
            </div>
            <div className ="flex">
                <li>{isLoggedIn && `Hi ${user}!`}</li>
                <li><button onClick ={(e) => this.handleLogin(e,"Sign Up")}>{!isLoggedIn && "Sign Up"}</button></li>
            </div>
        </nav>)
    }
    render() {
        const {loaded} = this.state
        const {theme} = this.props 
        const border = `2px solid ${theme ? "black" : "whitesmoke"}`
        const pass = "2px solid rgb(74, 193, 138)"
        const nopass = "2px solid  rgb(248, 105, 105)"
        return (
            <div>
                {this.getNav()}
                <Fade>
               <div className ="flex spaceEvenly">
                   
                   <div className = "flex baseLine">
                   <div className ="mr" >
                   <h2 className ="no miniTitle mr" style = {{border:nopass}}>In progress:</h2>
                   <div className ="flex biggrid">
                       {loaded && this.getRecipeCardsNotDone()}
                   </div>
                   </div>
                   <div>
                   <h2 className ="miniTitle pass" style = {{border:pass}}>Finished:</h2>
                   <div className ="flex biggrid">
                       {loaded && this.getRecipeCardsDone()}
                   </div>
                   </div>
                   </div>
               </div>
               </Fade>
            </div>
        )
    }
}
export default connect(
    state => {
        return { count:state.count, theme: state.theme};
    }
)(Day20);