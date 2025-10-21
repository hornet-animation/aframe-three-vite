import * as THREE from 'three'

// Custom rotating cube component
AFRAME.registerComponent('three-cube', {
  init() {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({ color: 0x00ffcc })
    this.mesh = new THREE.Mesh(geometry, material)
    this.el.object3D.add(this.mesh)

    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(0, 2, 2)
    this.el.sceneEl.object3D.add(light)
  },
  tick() {
    this.mesh.rotation.x += 0.02
    this.mesh.rotation.y += 0.02
  },
})
