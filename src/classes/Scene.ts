import * as THREE from 'three';
import {GUI} from 'dat.gui'
import Stats from 'stats.js';
import {UniformData} from '../types/Types.ts';
import vertexShader from '../shaders/vertex.glsl';
import fragmentShader from '../shaders/fragment.glsl';

export default class Scene {
    public canvas: HTMLElement | null;
    public scene: THREE.Scene | null;
    public camera: THREE.PerspectiveCamera | null;
    public renderer: THREE.WebGLRenderer | null;
    public shape: THREE.Mesh | null;
    public clock: THREE.Clock | null;

    private readonly fps: number;
    private then: number;
    private delta: number;
    private animateFrameId: number;
    private gui: GUI | null;
    private stats: Stats | null;
    private uniformData: UniformData;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId);
        this.animateFrameId = 0;
        this.then = 0;
        this.delta = 0;
        this.fps = 1000 / 60;
        this.clock = null;
        this.gui = null;
        this.stats = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.shape = null;
        this.uniformData = {
            uTime: {
                type: 'f',
                value: null,
            }
        };

        //Call init func
        this.init();
    }

    init() {
        //Set scene
        this.scene = new THREE.Scene();

        //Set clock
        this.clock = new THREE.Clock();

        //Setup external tools
        this.setupExternalTools();

        //Setup renderer
        this.setupRenderer();

        //Setup camera
        this.setupCamera();

        //Setup scene objects
        this.setupSceneObjects();

        //Setup event listeners
        this.setupEventListeners();

        //Set the initial uniform data uTime value
        this.uniformData.uTime.value = this.delta;

        //Start rendering
        this.animate();
    }

    setupRenderer() {
        //Early return
        if(!this.canvas) {
            return;
        }

        //Set renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'high-performance',
            canvas: this.canvas,
            alpha: true,
        });

        //Set extra attributes
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        //Set size & aspect ratio
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    setupCamera() {
        //Early return
        if(!this.canvas || !this.scene) {
            return;
        }

        //Set perspective camera
        this.camera = new THREE.PerspectiveCamera(70, this.canvas.offsetWidth / this.canvas.offsetHeight, 0.1, 800);
        this.camera.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
        this.camera.updateProjectionMatrix();

        //Setup camera
        this.camera.position.set(0, 0, 5);

        //Ad to scene
        this.scene.add(this.camera);
    }

    setupSceneObjects() {
        //Early return
        if(!this.scene) {
            return;
        }

        //Create a shape
        const geometry = new THREE.IcosahedronGeometry(2, 50);
        const material = new THREE.ShaderMaterial({
            uniforms: this.uniformData,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });
        this.shape = new THREE.Mesh(geometry, material);
        this.shape.castShadow = true;
        this.shape.receiveShadow = true;
        this.scene.add(this.shape);

        if(this.gui) {
            //Add to gui
            const shapeFolder = this.gui.addFolder('Box');
            shapeFolder.add(this.shape.scale, 'x', 1, 3);
            shapeFolder.add(this.shape.scale, 'y', 1, 3);
            shapeFolder.add(this.shape.scale, 'z', 1, 3);
            shapeFolder.open();
        }

        //Add directional scene light
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
        ambientLight.position.set(0, 0, 0);
        this.scene.add(ambientLight);
    }

    resize() {
        //Early return
        if(!this.camera || !this.renderer) {
            return;
        }

        //Set correct aspect
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        //Set canvas size again
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    setupEventListeners() {
        //Add events
        window.addEventListener('resize', () => this.resize());
    }

    setupExternalTools() {
        //Enable dat gui
        this.gui = new GUI();

        //Enable stats
        this.stats = new Stats();
        this.stats.showPanel(0);

        //Add stats container to body
        document.body.appendChild(this.stats.dom);
    }

    render() {
        //Early return
        if(!this.scene || !this.shape || !this.camera) {
            return
        }

        //Update uniform data
        this.uniformData.uTime.value = this.clock?.getElapsedTime() ? this.clock?.getElapsedTime() * 0.2 : 0;

        //Render
        this.renderer?.render(this.scene, this.camera);
    }

    animate() {
        //Animate request frame loop
        const now = Date.now();
        this.delta = now - this.then;

        //Begin stats
        this.stats?.begin();

        if (this.delta > this.fps) {
            this.then = now;

            //Render the frame
            this.render();
        }

        //End stats
        this.stats?.end();

        //Request a new frame
        this.animateFrameId = requestAnimationFrame(this.animate.bind(this));
    }

    destroy() {
        //Cancel animation loop
        cancelAnimationFrame(this.animateFrameId);
    }
}