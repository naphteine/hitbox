/*
 * Div (Digital inexpensive visuals) :: JS GUI Framework
 * Copyright (c) 2021 gguilt
 */

(function(Div, $, undefined) {
    "use strict";
    const canvas = document.getElementById("mainCanvas");
    const ctx = canvas.getContext("2d");

    /*
      Drawing functions
    */

    /* Rect components: x, y, width, height, *border, color */
    Div.drawRect = function(rect) {
        // Draw border if specified
        if (rect.border !== undefined) {
            let borderRect = {
                x: rect.x - rect.border,
                y: rect.y - rect.border,
                width: rect.width + 2*rect.border,
                height: rect.height + 2*rect.border,
                color: "black"
            };

            Div.drawRect(borderRect);
        }

        ctx.fillStyle = rect.color;
        ctx.beginPath();
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        ctx.stroke();
    };

    /* text, x, y */
    Div.drawText = function(text, x, y) {
        ctx.fillStyle = "black";
        ctx.font = "24px Arial";
        ctx.fillText(text, x, y);
    };

    /* Button components: x, y, width, height, color, text, *checkbox */
	  Div.drawButton = function(button) {
        if (button.checkbox !== undefined) {
            const checkbox = {
                x: button.x + 5,
                y: button.y + 5,
                width: button.height - 10,
                height: button.height - 10,
                border: 2,
                color: (button.checkbox) ? "black" : button.color
            };
            Div.drawRect(button);
            Div.drawRect(checkbox);
            Div.drawText(button.text, button.x + 30, button.y + 25);
        } else {
            Div.drawRect(button);
            Div.drawText(button.text, button.x + 5, button.y + 25);
        }
    };
}(window.Div = window.Div || {}));
