import { LightningElement } from 'lwc';
import { getActionInfo } from 'xiv/actionRepository';

const sortableList = document.getElementById("sortable");
const buttonGCD = document.getElementById('addGCDButton');
const buttonWeave = document.getElementById('addWeaveButton');
let draggedItem = null;

export default class HelloWorldApp extends LightningElement {
    mockActionList = ["Holy Spirit", "Holy Spirit", "Holy Spirit"].map(getActionInfo.bind(undefined, "pld"));
    job = "pld";
}

sortableList.addEventListener(
	"dragstart",
	(e) => {
		draggedItem = e.target;
		setTimeout(() => {
			e.target.style.display =
				"none";
		}, 0);
});

sortableList.addEventListener(
	"dragend",
	(e) => {
		setTimeout(() => {
			e.target.style.display = "";
			draggedItem = null;
		}, 0);
});

sortableList.addEventListener(
	"dragover",
	(e) => {
		e.preventDefault();
		const afterElement =
			getDragAfterElement(
				sortableList,
				e.clientX);
		const currentElement =
			document.querySelector(
				".dragging");
		if (afterElement == null) {
			sortableList.appendChild(
				draggedItem
			);} 
		else {
			sortableList.insertBefore(
				draggedItem,
				afterElement
			);}
	});

const getDragAfterElement = (
	container, x
) => {
	const draggableElements = [
		...container.querySelectorAll(
			"li:not(.dragging)"
		),];

	return draggableElements.reduce(
		(closest, child) => {
			const box =
				child.getBoundingClientRect();
			const offset =
				x - box.left - box.width / 2;
			if (offset < 0 && offset > closest.offset) {
				return { offset: offset, element: child,};
      } 
			else {
				return closest;
			}
    },
		{
			offset: Number.NEGATIVE_INFINITY,
		}
	).element;
};
