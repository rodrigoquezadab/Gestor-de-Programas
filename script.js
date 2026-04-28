document.addEventListener("DOMContentLoaded", () => {
  // Elementos del formulario y lista
  const programForm = document.getElementById("programForm");
  const programIdInput = document.getElementById("programId");
  const nameInput = document.getElementById("name");
  const versionInput = document.getElementById("version");
  const usageInfoInput = document.getElementById("usageInfo");
  const urlInput = document.getElementById("url");
  const addButton = document.getElementById("addButton");
  const updateButton = document.getElementById("updateButton");
  const cancelButton = document.getElementById("cancelButton");
  const programsListDiv = document.getElementById("programsList");
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const categoryFilter = document.getElementById("categoryFilter");
  const typeInput = document.getElementById("type");
  const categoryInput = document.getElementById("category");
  const toggleVisibilitySortButton = document.getElementById("toggleVisibilitySortButton");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const darkIcon = document.getElementById("darkIcon");
  const lightIcon = document.getElementById("lightIcon");
  const toolsToggleBtn = document.getElementById("toolsToggleBtn");
  const toolsMenu = document.getElementById("toolsMenu");

  // Elementos de acciones generales
  const downloadDataButton = document.getElementById("downloadDataButton");
  // CAMBIO: Ahora es un botón directo, no un label
  const uploadFileButton = document.getElementById("uploadFileButton");
  const removeDuplicatesButton = document.getElementById(
    "removeDuplicatesButton"
  );
  const cancelImportBtn = document.getElementById("cancelImportBtn");

  const fileUploadInput = document.getElementById("fileUpload");
  // CAMBIO: uploadFileInputContainer ya no existe en HTML
  // const uploadFileInputContainer = document.getElementById("uploadFileInputContainer");

  const importOptionsDiv = document.getElementById("importOptions");
  const importAddBtn = document.getElementById("importAddBtn");
  const importUpdateBtn = document.getElementById("importUpdateBtn");
  const importReplaceBtn = document.getElementById("importReplaceBtn");
  const loadBackupButton = document.getElementById("loadBackupButton");

  // Elementos del Modal
  const programModal = document.getElementById("programModal");
  const openAddProgramModalBtn = document.getElementById(
    "openAddProgramModalBtn"
  );
  const closeProgramModalBtn = document.getElementById("closeProgramModalBtn");

  // Botón para vaciar la lista
  const clearAllProgramsButton = document.getElementById(
    "clearAllProgramsButton"
  );

  // Elemento para el contador de programas
  const programCountSpan = document.getElementById("programCount");

  // Array para almacenar los programas
  let programs = [];
  let programsToImport = [];
  let isListHidden = false;
  let isSortedAlphabetically = false;

  // --- DARK MODE LOGIC ---
  const html = document.documentElement;
  if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
    darkIcon.classList.remove('hidden');
    lightIcon.classList.add('hidden');
  } else {
    html.classList.remove('dark');
    darkIcon.classList.add('hidden');
    lightIcon.classList.remove('hidden');
  }

  darkModeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    if (html.classList.contains('dark')) {
      localStorage.setItem('theme', 'dark');
      darkIcon.classList.remove('hidden');
      lightIcon.classList.add('hidden');
    } else {
      localStorage.setItem('theme', 'light');
      darkIcon.classList.add('hidden');
      lightIcon.classList.remove('hidden');
    }
  });

  // --- TOOLS MENU LOGIC ---
  toolsToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toolsMenu.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!toolsToggleBtn.contains(e.target) && !toolsMenu.contains(e.target)) {
      toolsMenu.classList.add('hidden');
    }
    
    if (!e.target.closest('.card-menu-btn')) {
      document.querySelectorAll('.card-menu-dropdown').forEach(dropdown => {
        dropdown.classList.add('hidden');
      });
    }
  });

  // --- FUNCIONES DE MODAL ---
  const openProgramModal = (isEdit = false, programData = null) => {
    programModal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden"); // Ocultar el scroll del body

    programForm.reset();

    if (isEdit && programData) {
      programIdInput.value = programData.id;
      nameInput.value = programData.name;
      versionInput.value = programData.version;
      usageInfoInput.value = programData.usageInfo;
      urlInput.value = programData.url;
      typeInput.value = programData.type || "Aplicación de Escritorio";
      categoryInput.value = programData.category || "Otros";

      addButton.classList.add("hidden");
      updateButton.classList.remove("hidden");
      cancelButton.classList.remove("hidden");
    } else {
      programIdInput.value = "";
      addButton.classList.remove("hidden");
      updateButton.classList.add("hidden");
      cancelButton.classList.add("hidden");
    }
  };

  const closeProgramModal = () => {
    programModal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden"); // Volver a habilitar el scroll
    programForm.reset();
    cancelEdit();
  };

  // --- FUNCIONES DE ALMACENAMIENTO Y RENDERIZADO ---
  const savePrograms = () => {
    localStorage.setItem("programs", JSON.stringify(programs));
    checkAndShowRemoveDuplicatesButton();
    checkAndShowClearAllProgramsButton();
    updateProgramCount(); // Actualizar contador al guardar
  };

  const loadPrograms = () => {
    const storedPrograms = localStorage.getItem("programs");
    if (storedPrograms) {
      programs = JSON.parse(storedPrograms);
    }
    renderPrograms();
    checkAndShowRemoveDuplicatesButton();
    checkAndShowClearAllProgramsButton();
    updateProgramCount(); // Actualizar contador al cargar
  };

  const renderPrograms = () => {
    programsListDiv.innerHTML = "";
    if (isListHidden) {
      programsListDiv.innerHTML = "<p class='text-center text-gray-500'>La lista está oculta.</p>";
      return;
    }

    const searchTerm = searchInput.value.toLowerCase();
    const typeTerm = typeFilter.value;
    const categoryTerm = categoryFilter.value;

    let filteredPrograms = programs.filter((program) => {
      const name = String(program.name || "").toLowerCase();
      const version = String(program.version || "").toLowerCase();
      const usageInfo = String(program.usageInfo || "").toLowerCase();
      const typeStr = String(program.type || "").toLowerCase();
      const categoryStr = String(program.category || "").toLowerCase();

      const matchesSearch = name.includes(searchTerm) ||
        version.includes(searchTerm) ||
        usageInfo.includes(searchTerm) ||
        typeStr.includes(searchTerm) ||
        categoryStr.includes(searchTerm);
      
      const matchesType = typeTerm === "" || program.type === typeTerm;
      const matchesCategory = categoryTerm === "" || program.category === categoryTerm;

      return matchesSearch && matchesType && matchesCategory;
    });

    if (isSortedAlphabetically) {
      filteredPrograms.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
    }

    if (filteredPrograms.length === 0) {
      programsListDiv.innerHTML =
        "<p class='text-center text-gray-500'>No hay programas guardados o no se encontraron resultados.</p>";
    }

    filteredPrograms.forEach((program) => {
      const programItem = document.createElement("div");
      programItem.className =
        "program-item bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl";
      
      let typeBadgeClass = program.type === "Web App" 
        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800/50" 
        : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800/50";

      programItem.innerHTML = `
        <div class="mb-2 flex flex-col h-full">
          <div class="flex justify-between items-start mb-3 relative">
            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight pr-12">${program.name} <span class="text-brand-500 text-sm font-medium ml-1">${program.version}</span></h3>
            
            <div class="absolute right-0 top-0 flex items-center gap-1">
              ${
                program.url
                  ? `<a href="${program.url}" target="_blank" title="Abrir enlace" class="text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors text-lg p-1">🔗</a>`
                  : ""
              }
              <div class="relative">
                <button class="card-menu-btn text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xl font-bold leading-none">
                  ⋮
                </button>
                <div class="card-menu-dropdown absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hidden z-20 overflow-hidden transform origin-top-right transition-all">
                  <button data-id="${program.id}" class="edit-btn w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                    ✏️ Editar
                  </button>
                  <button data-id="${program.id}" class="delete-btn w-full text-left px-4 py-2.5 text-sm hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium border-t border-gray-100 dark:border-gray-700">
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2 mb-3">
            ${program.type ? `<span class="text-[10px] font-extrabold px-2 py-0.5 rounded-lg border ${typeBadgeClass} uppercase tracking-wider">${program.type}</span>` : ''}
            ${program.category ? `<span class="text-[10px] font-extrabold px-2 py-0.5 rounded-lg border bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 uppercase tracking-wider">${program.category}</span>` : ''}
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">${program.usageInfo}</p>
        </div>
      `;
      programsListDiv.appendChild(programItem);
    });

    // Menús de tarjetas
    document.querySelectorAll(".card-menu-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const dropdown = btn.nextElementSibling;
        
        // Cerrar otros menús primero
        document.querySelectorAll('.card-menu-dropdown').forEach(d => {
          if (d !== dropdown) d.classList.add('hidden');
        });
        
        dropdown.classList.toggle("hidden");
      });
    });

    document.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const idToEdit = e.target.dataset.id;
        const programToEdit = programs.find(
          (program) => program.id === idToEdit
        );
        if (programToEdit) {
          openProgramModal(true, programToEdit);
        }
      });
    });
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", deleteProgram);
    });

    checkAndShowClearAllProgramsButton();
  };

  // --- CRUD DE PROGRAMAS ---
  const generateId = () => {
    return "_" + Math.random().toString(36).substr(2, 9);
  };

  const addProgram = (e) => {
    e.preventDefault();
    const newProgram = {
      id: generateId(),
      name: nameInput.value,
      version: versionInput.value,
      usageInfo: usageInfoInput.value,
      url: urlInput.value,
      type: typeInput.value,
      category: categoryInput.value,
    };
    programs.push(newProgram);
    savePrograms();
    renderPrograms();
    closeProgramModal();
  };

  const updateProgram = () => {
    const idToUpdate = programIdInput.value;
    const programIndex = programs.findIndex(
      (program) => program.id === idToUpdate
    );

    if (programIndex > -1) {
      programs[programIndex] = {
        id: idToUpdate,
        name: nameInput.value,
        version: versionInput.value,
        usageInfo: usageInfoInput.value,
        url: urlInput.value,
        type: typeInput.value,
        category: categoryInput.value,
      };
      savePrograms();
      renderPrograms();
      closeProgramModal();
    }
  };

  const deleteProgram = (e) => {
    if (confirm("¿Estás seguro de que quieres eliminar este programa?")) {
      const idToDelete = e.target.dataset.id;
      programs = programs.filter((program) => program.id !== idToDelete);
      savePrograms();
      renderPrograms();
    }
  };

  const cancelEdit = () => {
    programForm.reset();
    programIdInput.value = "";
    addButton.classList.remove("hidden");
    updateButton.classList.add("hidden");
    cancelButton.classList.add("hidden");
  };

  const handleFilterChange = () => {
    if (isListHidden) {
      isListHidden = false;
      isSortedAlphabetically = false;
      if (toggleVisibilitySortButton) toggleVisibilitySortButton.innerHTML = "🔤 Ordenar A-Z";
    }
    renderPrograms();
  };

  searchInput.addEventListener("keyup", handleFilterChange);
  typeFilter.addEventListener("change", handleFilterChange);
  categoryFilter.addEventListener("change", handleFilterChange);

  if (toggleVisibilitySortButton) {
    toggleVisibilitySortButton.addEventListener("click", () => {
      if (!isListHidden && !isSortedAlphabetically) {
        isSortedAlphabetically = true;
        toggleVisibilitySortButton.innerHTML = "🙈 Ocultar Lista";
      } else if (!isListHidden && isSortedAlphabetically) {
        isListHidden = true;
        isSortedAlphabetically = false;
        toggleVisibilitySortButton.innerHTML = "👁️ Mostrar Lista (A-Z)";
      } else if (isListHidden) {
        isListHidden = false;
        isSortedAlphabetically = true;
        toggleVisibilitySortButton.innerHTML = "🙈 Ocultar Lista";
      }
      renderPrograms();
    });
  }

  // --- FUNCIONES DE EXPORTACIÓN/IMPORTACIÓN ---
  const downloadData = () => {
    const dataStr = JSON.stringify(programs, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "programas.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        programsToImport = JSON.parse(e.target.result);
        if (Array.isArray(programsToImport)) {
          showImportOptions();
        } else {
          alert("El archivo JSON no contiene un array de programas válido.");
          resetUploadFlow();
        }
      } catch (error) {
        alert("Error al leer el archivo JSON: " + error.message);
        resetUploadFlow();
      }
    };
    reader.readAsText(file);
  };

  const loadBackupData = async () => {
    if (
      !confirm(
        "¿Estás seguro de que quieres cargar los datos de respaldo? Esto abrirá las opciones de importación."
      )
    ) {
      return;
    }
    try {
      const response = await fetch("programas_bkup.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      programsToImport = await response.json();
      if (Array.isArray(programsToImport)) {
        showImportOptions();
      } else {
        alert("El archivo programas_bkup.json no contiene un array válido.");
        resetUploadFlow();
      }
    } catch (error) {
      alert("Error al cargar programas_bkup.json: " + error.message);
      resetUploadFlow();
    }
  };

  const showImportOptions = () => {
    importOptionsDiv.classList.remove("hidden");
    // CAMBIO: Ocultamos el botón de carga de archivo ahora
    uploadFileButton.classList.add("hidden");
    // uploadFileInputContainer ya no existe
    downloadDataButton.classList.add("hidden");
    loadBackupButton.classList.add("hidden");
  };

  const resetUploadFlow = () => {
    importOptionsDiv.classList.add("hidden");
    programsToImport = [];
    // CAMBIO: Mostramos el botón de carga de archivo
    uploadFileButton.classList.remove("hidden");
    // uploadFileInputContainer ya no existe
    fileUploadInput.value = "";
    downloadDataButton.classList.remove("hidden");
    loadBackupButton.classList.remove("hidden");
    checkAndShowRemoveDuplicatesButton();
    checkAndShowClearAllProgramsButton();
    updateProgramCount(); // Actualizar contador al resetear el flujo
  };

  const importData = (type) => {
    if (programsToImport.length === 0) {
      alert("No hay datos para importar.");
      resetUploadFlow();
      return;
    }

    if (
      !confirm(
        `¿Estás seguro de que quieres realizar esta operación de importación (${type})?`
      )
    ) {
      return;
    }

    switch (type) {
      case "add":
        programsToImport.forEach((newProgram) => {
          if (!programs.some((existing) => existing.id === newProgram.id)) {
            programs.push(newProgram);
          }
        });
        break;
      case "update":
        programsToImport.forEach((newProgram) => {
          const existingIndex = programs.findIndex(
            (existing) => existing.id === newProgram.id
          );
          if (existingIndex > -1) {
            programs[existingIndex] = newProgram;
          } else {
            programs.push(newProgram);
          }
        });
        break;
      case "replace":
        programs = programsToImport;
        break;
      default:
        console.warn("Tipo de importación desconocido:", type);
        break;
    }

    savePrograms();
    renderPrograms();
    alert(`Importación '${type}' completada exitosamente.`);
    resetUploadFlow();
  };

  // --- FUNCIONES DE MANEJO DE DUPLICADOS ---
  const findDuplicatesById = () => {
    const seenIds = new Set();
    for (const program of programs) {
      if (seenIds.has(program.id)) {
        return true;
      }
      seenIds.add(program.id);
    }
    return false;
  };

  const removeActualDuplicates = () => {
    if (
      confirm(
        "Esto eliminará todas las entradas duplicadas (manteniendo la primera que encuentre de cada ID). ¿Continuar?"
      )
    ) {
      const uniquePrograms = [];
      const seenIds = new Set();
      programs.forEach((program) => {
        if (!seenIds.has(program.id)) {
          uniquePrograms.push(program);
          seenIds.add(program.id);
        }
      });
      if (uniquePrograms.length < programs.length) {
        programs = uniquePrograms;
        savePrograms();
        renderPrograms();
        alert("Duplicados eliminados exitosamente.");
      } else {
        alert("No se encontraron duplicados para eliminar.");
      }
    }
  };

  const checkAndShowRemoveDuplicatesButton = () => {
    if (programs.length >= 2 && findDuplicatesById()) {
      removeDuplicatesButton.style.display = "inline-block";
    } else {
      removeDuplicatesButton.style.display = "none";
    }
  };

  // Función para vaciar todos los programas
  const clearAllPrograms = () => {
    if (
      confirm(
        "¿Estás seguro de que quieres eliminar TODOS los programas de la lista? Esta acción es irreversible."
      )
    ) {
      programs = []; // Vaciar el array de programas
      savePrograms(); // Guardar el estado vacío
      renderPrograms(); // Volver a renderizar la lista (ahora vacía)
      alert("Todos los programas han sido eliminados.");
    }
  };

  // Función para controlar la visibilidad del botón "Vaciar Lista"
  const checkAndShowClearAllProgramsButton = () => {
    if (programs.length > 0) {
      clearAllProgramsButton.style.display = "inline-block";
    } else {
      clearAllProgramsButton.style.display = "none";
    }
  };

  // Función para actualizar el contador de programas
  const updateProgramCount = () => {
    programCountSpan.textContent = programs.length;
  };

  // --- EVENT LISTENERS ---
  openAddProgramModalBtn.addEventListener("click", () =>
    openProgramModal(false)
  );
  closeProgramModalBtn.addEventListener("click", closeProgramModal);

  programModal.addEventListener("click", (e) => {
    if (e.target === programModal) {
      closeProgramModal();
    }
  });

  programForm.addEventListener("submit", addProgram);
  updateButton.addEventListener("click", updateProgram);
  cancelButton.addEventListener("click", closeProgramModal);

  downloadDataButton.addEventListener("click", downloadData);

  // CAMBIO: Listener para el nuevo botón de carga de archivo
  uploadFileButton.addEventListener("click", () => {
    fileUploadInput.click(); // Simula un clic en el input de tipo file oculto
  });
  // El listener para el 'change' del input de archivo sigue siendo el mismo
  fileUploadInput.addEventListener("change", handleFileUpload);

  loadBackupButton.addEventListener("click", loadBackupData);

  importAddBtn.addEventListener("click", () => importData("add"));
  importUpdateBtn.addEventListener("click", () => importData("update"));
  importReplaceBtn.addEventListener("click", () => importData("replace"));
  cancelImportBtn.addEventListener("click", resetUploadFlow);

  if (removeDuplicatesButton) {
    removeDuplicatesButton.addEventListener("click", removeActualDuplicates);
  }

  if (clearAllProgramsButton) {
    clearAllProgramsButton.addEventListener("click", clearAllPrograms);
  }

  // --- INICIALIZACIÓN ---
  loadPrograms();
});
