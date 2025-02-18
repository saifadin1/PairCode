require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.34.1/min/vs' } });

require(['vs/editor/editor.main'], function () {
    var editor = monaco.editor.create(document.getElementById('monaco-editor-container'), {
        value: '',
        language: 'javascript',
        theme: 'vs-dark',
        automaticLayout: true,
    });

    let isUpdatingFromRemote = false;

    connection.on("SyncEditor", (newCode) => {
        const currentValue = editor.getValue();

        // Check if the received text is different from the current value
        if (newCode !== currentValue) {
            isUpdatingFromRemote = true;  // Set flag to avoid recursive updates
            editor.setValue(newCode);      // Set the new value in the editor
            isUpdatingFromRemote = false; // Reset the flag after updating
        }
    });

    // Send the code to the server
    editor.onDidChangeModelContent((event) => {
        if (isUpdatingFromRemote) {
            // Skip if the update came from a remote source
            return;
        }

        // Get the current value from the editor
        var text = editor.getValue();

        // Send the updated code to the server
        connection.invoke("SyncCodeEditor", roomId, text).catch(function (err) {
            return console.error(err.toString());
        });
    });
});