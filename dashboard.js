document.addEventListener('DOMContentLoaded', () => {
    const dashboardContent = document.getElementById('dashboard-content');
    const refreshBtn = document.getElementById('refreshBtn');

    const positionDisplayNames = {
        presidents: 'Presidents',
        vicePresidents: 'Vice Presidents',
        treasurers: 'Treasurers',
        secretaries: 'Secretaries',
        pios: 'PIOs'
    };

    const renderDashboard = async () => {
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const storedData = JSON.parse(localStorage.getItem('electionData'));
        
        if (!storedData || Object.keys(storedData.votes).length === 0) {
            dashboardContent.innerHTML = '<p>No votes have been cast yet.</p>';
            return;
        }

        const votes = storedData.votes;
        let contentHTML = '';

        for (const position in votes) {
            const positionName = positionDisplayNames[position] || position;
            const candidates = votes[position];
            
            contentHTML += `<div class="tally-section"><h3>${positionName} Tally</h3><ul>`;
            
            for (const candidate in candidates) {
                const voteCount = candidates[candidate];
                contentHTML += `<li>${candidate}<span class="vote-count">${voteCount}</span></li>`;
            }
            
            contentHTML += `</ul></div>`;
        }
        
        dashboardContent.innerHTML = contentHTML;
    };

    refreshBtn.addEventListener('click', () => {
        console.log('Refresh button was clicked!');
        renderDashboard();
    });

    window.addEventListener('storage', (e) => {
        if (e.key === 'electionData') {
            renderDashboard();
        }
    });

    renderDashboard();
});