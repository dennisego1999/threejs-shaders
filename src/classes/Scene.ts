import * as THREE from 'three';
import {GUI} from 'dat.gui'
import Stats from 'stats.js';
export default class Scene {
    public canvas: HTMLElement | null;
    public scene: THREE.Scene | null;
    public camera: THREE.PerspectiveCamera | null;
    public renderer: THREE.WebGLRenderer | null;
    public box: THREE.Mesh | null;

    private readonly fps: number;
    private then: number;
    private animateFrameId: number;
    private gui: GUI | null;
    private stats: Stats | null;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId);
        this.animateFrameId = 0;
        this.then = 0;
        this.fps = 1000 / 60;
        this.gui = null;
        this.stats = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.box = null;

        //Call init func
        this.init();
    }

    init() {
        //Set scene
        this.scene = new THREE.Scene();

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

        //Create a box
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshNormalMaterial();
        this.box = new THREE.Mesh(geometry, material);
        this.box.castShadow = true;
        this.box.receiveShadow = true;
        this.scene.add(this.box);

        if(this.gui) {
            //Add to gui
            const boxFolder = this.gui.addFolder('Box');
            boxFolder.add(this.box.scale, 'x', 1, 3);
            boxFolder.add(this.box.scale, 'y', 1, 3);
            boxFolder.add(this.box.scale, 'z', 1, 3);
            boxFolder.open();
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
        document.body.appendChild(this.stats.dom);
    }

    render(delta: number) {
        //Early return
        if(!this.scene || !this.box || !this.camera) {
            return
        }


        if(this.box) {
            //Rotate the box
            const rotationSpeed = 0.0002;
            this.box.rotation.x += rotationSpeed * delta;
            this.box.rotation.y += rotationSpeed * delta;
            this.box.rotation.z += rotationSpeed * delta;
        }

        //Render
        this.renderer?.render(this.scene, this.camera);
    }

    animate() {
        //Animate request frame loop
        const now = Date.now();
        const delta: number = now - this.then;

        //Begin stats
        this.stats?.begin();

        if (delta > this.fps) {
            this.then = now;

            //Render the frame
            this.render(delta);
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