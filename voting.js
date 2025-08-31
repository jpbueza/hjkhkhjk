document.addEventListener('DOMContentLoaded', () => {
    const votingForm = document.getElementById('votingForm');
    const voterIdInput = document.getElementById('voterId');
    const messageArea = document.getElementById('messageArea');
    const candidateButtons = document.querySelectorAll('.candidate-btn');

    for (let i = 0; i < candidateButtons.length; i++) {
        candidateButtons[i].addEventListener('click', (event) => {
            const clickedButton = event.target;
            const parentCandidatesDiv = clickedButton.parentElement;

            const buttonsInThisSection = parentCandidatesDiv.querySelectorAll('.candidate-btn');
            for (let j = 0; j < buttonsInThisSection.length; j++) {
                buttonsInThisSection[j].classList.remove('selected');
            }

            clickedButton.classList.add('selected');
        });
    }

    votingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        messageArea.textContent = '';
        messageArea.className = 'message';

        const voterId = voterIdInput.value.trim();

        if (voterId === '') {
            showMessage('Please enter your ID number.', 'error');
            return;
        }

        let electionData = JSON.parse(localStorage.getItem('electionData'));
        if (!electionData) {
            electionData = { votes: {}, votedIDs: [] };
        }

        let idHasVoted = false;
        for (let i = 0; i < electionData.votedIDs.length; i++) {
            if (electionData.votedIDs[i] === voterId) {
                idHasVoted = true;
                break;
            }
        }
        if (idHasVoted) {
            showMessage('This ID has already voted.', 'error');
            return;
        }

        const selectedVotes = {};
        const positions = document.querySelectorAll('.position-section');
        let allPositionsVoted = true;

        for (let i = 0; i < positions.length; i++) {
            const positionSection = positions[i];
            const positionName = positionSection.querySelector('.candidates').dataset.position;
            const selectedButton = positionSection.querySelector('.candidate-btn.selected');
            
            if (selectedButton) {
                selectedVotes[positionName] = selectedButton.dataset.candidate;
            } else {
                allPositionsVoted = false;
                break;
            }
        }

        if (!allPositionsVoted) {
            showMessage('Please select a candidate for all positions.', 'error');
            return;
        }

        saveVote(voterId, selectedVotes);
        showMessage('Your vote has been submitted successfully!', 'success');
        
        votingForm.reset();
        for (let i = 0; i < candidateButtons.length; i++) {
            candidateButtons[i].classList.remove('selected');
        }
    });

    function saveVote(voterId, votes) {
        let electionData = JSON.parse(localStorage.getItem('electionData'));
        if (!electionData) {
            electionData = { votes: {}, votedIDs: [] };
        }

        for (const position in votes) {
            if (!electionData.votes[position]) {
                electionData.votes[position] = {};
            }
            const candidate = votes[position];
            if (!electionData.votes[position][candidate]) {
                electionData.votes[position][candidate] = 0;
            }
            electionData.votes[position][candidate]++;
        }

        electionData.votedIDs.push(voterId);

        localStorage.setItem('electionData', JSON.stringify(electionData));
    }

    function showMessage(msg, type) {
        messageArea.textContent = msg;
        messageArea.className = `message ${type}`;
    }
});