// Essayer de parser les tâches depuis le localStorage ou utiliser des valeurs par défaut
let tasks;
try {
    // Tenter de récupérer les tâches stockées dans le localStorage
    tasks = JSON.parse(localStorage.getItem('tasks')) || [
        // Si aucune tâche n'est trouvée, utiliser un tableau par défaut
        {
            title: "Apprendre mon cours de JavaScript",
            priority: 1
        },
        {
            title: "Créer mon compte Github",
            priority: 2
        },
        {
            title: "Répondre à mes emails",
            priority: 3
        }
    ];
} catch (e) {
    // En cas d'erreur lors du parsing, afficher l'erreur dans la console
    console.error('Erreur lors du parsing des tâches:', e);
    // Réinitialisation des tâches par défaut si le parsing échoue
    tasks = [
        {
            title: "Apprendre mon cours de JavaScript",
            priority: 1
        },
        {
            title: "Créer mon compte Github",
            priority: 2
        },
        {
            title: "Répondre à mes emails",
            priority: 3
        }
    ];
    // Enregistrer les valeurs par défaut dans le localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Écouter l'événement DOMContentLoaded pour s'assurer que le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    // Récupération des éléments DOM nécessaires
    const taskList = document.getElementById('taskList');
    const taskForm = document.getElementById('taskForm');
    const deleteTasksButton = document.getElementById('deleteTasks');
    const notification = document.getElementById('notification');

    // Fonction pour créer un élément <li> pour une tâche
    function createTaskElement(task, index) {
        const li = document.createElement('li'); // Créer un nouvel élément de liste
        li.classList.add(`priority-${task.priority}`); // Ajouter une classe en fonction de la priorité
        li.innerHTML = `
            <label>
                <input type="checkbox" data-index="${index}"> <!-- Ajouter un checkbox avec index -->
                ${task.title} <!-- Afficher le titre de la tâche -->
            </label>
        `;

        // Ajouter l'événement pour rayer la tâche quand elle est cochée
        const checkbox = li.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                li.classList.add('completed'); // Ajouter la classe 'completed' si la case est cochée
            } else {
                li.classList.remove('completed'); // Retirer la classe si la case est décochée
            }
        });

        return li; // Retourner l'élément de liste créé
    }

    // Fonction pour afficher la liste des tâches
    function displayTasks() {
        // Trier les tâches par priorité (1 = la plus haute priorité)
        const sortedTasks = tasks.sort((a, b) => a.priority - b.priority);
        taskList.innerHTML = '';  // Vider le DOM avant d'afficher les tâches
        sortedTasks.forEach((task, index) => {
            const taskElement = createTaskElement(task, index);
            taskList.appendChild(taskElement); // Ajouter chaque tâche au DOM
        });
    }

    // Fonction pour mettre à jour le localStorage
    function updateLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Enregistrer les tâches mises à jour
    }

    // Ajouter une nouvelle tâche
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Empêcher le comportement par défaut du formulaire
        const title = document.getElementById('taskTitle').value; // Récupérer le titre de la tâche
        const priority = parseInt(document.getElementById('taskPriority').value); // Récupérer la priorité

        // Vérifier si le titre de la tâche est vide
        if (title.trim() === '') {
            alert('Veuillez entrer un nom de tâche.'); // Afficher un message d'alerte
            return;
        }

        const newTask = { title, priority }; // Créer un nouvel objet tâche
        tasks.push(newTask);  // Ajouter la nouvelle tâche au tableau

        // Trier les tâches après ajout
        tasks.sort((a, b) => a.priority - b.priority);

        updateLocalStorage();  // Mettre à jour le localStorage avec les nouvelles tâches

        // Réafficher toutes les tâches après ajout
        displayTasks();

        taskForm.reset();  // Réinitialiser le formulaire
    });

    // Supprimer les tâches sélectionnées
    deleteTasksButton.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('#taskList input[type="checkbox"]:checked'); // Récupérer les cases cochées
        const indicesToDelete = Array.from(checkboxes).map(checkbox => parseInt(checkbox.getAttribute('data-index'))); // Récupérer les index des tâches à supprimer

        // Supprimer les tâches du tableau en partant des plus grandes index pour éviter les décalages
        const deletedCount = indicesToDelete.length;
        indicesToDelete.sort((a, b) => b - a).forEach(index => {
            tasks.splice(index, 1); // Supprimer la tâche à l'index spécifié
        });

        // Réafficher toutes les tâches après suppression
        displayTasks();  // Réafficher la liste mise à jour

        // Afficher le message de notification
        if (deletedCount > 0) {
            notification.textContent = `${deletedCount} tâche(s) supprimée(s) avec succès.`; // Afficher le message de succès
            setTimeout(() => {
                notification.textContent = ''; // Effacer le message après 3 secondes
            }, 3000);
        }
        
        updateLocalStorage();  // Mettre à jour le localStorage
    });

    // Affichage initial des tâches
    displayTasks(); // Afficher les tâches au chargement de la page
});
