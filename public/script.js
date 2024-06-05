document.addEventListener("DOMContentLoaded", function() {
    const button = document.getElementById("runScriptButton");

    button.addEventListener("click", async function() {
        try {
            const response = await fetch("/runtask", {
                method: "POST"
            });

            if (response.ok) {
                const result = await response.json();
                displayResult(result);
            } else {
                console.error("Error:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });

    function displayResult(result) {
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `
            <p>These are the most happening topics as on ${result.dateTime}</p>
            <ul>
                <li>Name of trend1 ${result.nameOfTrend1}</li>
                <li>Name of trend2 ${result.nameOfTrend2}</li>
                <li>Name of trend3 ${result.nameOfTrend3}</li>
                <li>Name of trend4 ${result.nameOfTrend4}</li>
                <li>Name of trend5 ${result.nameOfTrend5}</li>
            </ul>
            <p>The IP address used for this query was ${result.ipAddress}</p>

            <p>Here’s a JSON extract of this record from the MongoDB:</p>
            <pre>${JSON.stringify(result, null, 2)}</pre>
        `;

        // Hide the heading and button
        document.getElementById("heading-container").style.display = "none";

        // Create a new button to run the query again
        const runAgainButton = document.createElement("button");
        runAgainButton.textContent = "Click here to run the query again";
        runAgainButton.addEventListener("click", async function() {
            try {
                const response = await fetch("/runtask", {
                    method: "POST"
                });

                if (response.ok) {
                    const result = await response.json();
                    displayResult(result);
                } else {
                    console.error("Error:", response.statusText);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });

        // Append the new button to the resultDiv
        resultDiv.appendChild(runAgainButton);
    
    }
});