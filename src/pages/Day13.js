import React from "react"
import * as THREE from 'three';
import { shapesInner, shapesOuter } from "./Components1/day13/shapes"
var id = null 
export default class Day13 extends React.Component {
    constructor() {
        super()
        this.state = {
            value1: "icosahedron",
            value2: "torusKnot"
        }
    }
    componentDidMount() {
        this.startAnimate()
    }
    componentDidUpdate(prevprops, prevState) {
        const { value1, value2 } = this.state
        if (value1 !== prevState.value1 || value2 !== prevState.value2) {
            this.startAnimate()
        }
    }
    startAnimate = () => {
        const { value1, value2 } = this.state
        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        // delete previous dom 
        this.removeAllChildNodes(this.refs.div)
        this.refs.div.appendChild(renderer.domElement);
        let shapes = [shapesInner[value1], shapesOuter[value2]]
        shapes.forEach((shape) => scene.add(shape))
        if (id !== null)
            cancelAnimationFrame(id)
        const animate = () => {
            id = requestAnimationFrame(animate);
            shapes.forEach((shape) => {
                shape.rotation.x += 0.01
                shape.rotation.y += 0.01
            })
            renderer.render(scene, camera);
        }
        animate()
    }

    removeAllChildNodes = (parent) => {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
    handleChange1 = (e) => {
        this.setState({ value1: e.target.value })
    }
    handleChange2 = (e) => {
        this.setState({ value2: e.target.value })
    }
    setDropdowns = () => {
        return (
            <div className="big center">
                <label>Choose an outer shape:</label>
                <select onChange={this.handleChange2}>
                    <option value="torusKnot">Torus Knot</option>
                    <option value="torus">Torus</option>
                    <option value="tube">Tube</option>
                    <option value="parametric">Parametric</option>
                </select>
                <label>Choose an inner shape:</label>
                <select onChange={this.handleChange1}>
                    <option value="icosahedron">Icosahedron</option>
                    <option value="tetrahedron">Tetrahedron</option>
                    <option value="dodecahedron">Dodecahedron</option>
                    <option value="octahedron">Octahedron</option>
                    <option value="cone">Cone</option>
                </select>
            </div>
        )
    }
    render() {
        return (
            <>
                {this.setDropdowns()}
                <div style={{ overflowY: "hidden", overflow: "hidden" }} ref="div"> </div>
                <p style={{ textAlign: "right" }}><i>Animated with Three.js</i></p>
            </>
        )
    }
}