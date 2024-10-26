
        const terminalContent = document.getElementById('terminalContent');
        const ramDisplay = document.getElementById('ram');
        const cpuDisplay = document.getElementById('cpu');
        const diskDisplay = document.getElementById('disk');
        const statusDisplay = document.getElementById('status');
        const uptimeDisplay = document.getElementById('uptime');
        const serverIdDisplay = document.getElementById('serverId');
        const terminal = document.getElementById('terminal');

        function generateRandomServerId() {
            return Math.random().toString(36).substring(2, 10); 
        }

        function initializeServerInfo() {
            const ramUsed = Math.floor(Math.random() * 1024);
            const diskUsed = Math.floor(Math.random() * 2024);

            ramDisplay.textContent = `${ramUsed.toFixed(2)} MiB / 1024 GiB`;
            diskDisplay.textContent = `${diskUsed.toFixed(2)} MB / 1024 GB`;
            serverIdDisplay.textContent = generateRandomServerId();
        }

        function updateCpuUsage() {
            const currentCpuUsage = Math.floor(Math.random() * 100);
            cpuDisplay.textContent = `${currentCpuUsage}% / 100%`;

            if (currentCpuUsage > 80) {
                statusDisplay.textContent = "Overload detected!";
                statusDisplay.className = "status-warning";
            } else {
                statusDisplay.textContent = "Running";
                statusDisplay.className = "status-running";
            }
        }

        function simulateTerminal() {
            const command = `[${new Date().toLocaleTimeString()}] System: Monitoring server status...`;
            terminalContent.innerHTML += command + '\n';
            terminal.scrollTop = terminal.scrollHeight;
        }

        function simulateDiskActivity() {
            const activity = `[${new Date().toLocaleTimeString()}] Disk: Writing ${Math.random().toFixed(2)} MB of data`;
            terminalContent.innerHTML += activity + '\n';
            terminal.scrollTop = terminal.scrollHeight;
        }

        initializeServerInfo();

        setInterval(updateCpuUsage, 1000);
        setInterval(simulateTerminal, 3000);
        setInterval(simulateDiskActivity, 4000);
