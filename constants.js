var canvas = document.getElementById('canvas')
var renderer = document.getElementById('renderer')
var mapImg = document.getElementById('mapImg')
var psprites = document.getElementById('psprites')
const GRAVITY = 1;
const FRICTION = .85;

const W = renderer.width
const H = renderer.height

const P_CROUCH_DUR = 6;
const P_LAND_DUR = 14;

const TAU = 2 * Math.PI;
