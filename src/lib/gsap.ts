import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Draggable } from 'gsap/Draggable';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Draggable);
}

export { gsap, ScrollTrigger, ScrollToPlugin, Draggable };