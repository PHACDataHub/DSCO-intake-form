import React, { useState, useEffect } from 'react'

function Form() {
    const [formData, setFormData] = useState({
        clientOrg: '',
        projectName: '',
        projectDescription: '',
        projectLead: '',
        members: '',
        hasYubi: false,
        dataSens: '',
        ObjectName: '',
        FolderName: '',
        selectedValue: '',
    })

    const envs = ['Dev', 'Test', 'Prod', 'Exp', 'Other'];

    const [projects, setProjects] = useState([]);

    const handleOptionChange = (event) => {
        const { value } = event.target;
        let selectedVal;
        if (value === "Dev") {
            selectedVal = "d";
        } else if (value === "Test") {
            selectedVal = "t";
        } else if (value === "Prod") {
            selectedVal = "p";
        } else if (value === "Exp") {
            selectedVal = "x";
        } else if (value === "Other") {
            selectedVal = "o";
        }

        // Update the formData state with selectedValue
        setFormData({ ...formData, selectedValue: selectedVal });

        // Update the envValid state based on whether a value is selected
    }

    async function GetName() {
        console.log("GetName() function called");
        const objectName = ("ph" + formData.selectedValue + "-" + formData.projectName.replace(/\s/g, "").toLowerCase());
        const folderName = ("ph-" + formData.projectName.replace(/\s/g, "").toLowerCase());
        setFormData({ ...formData, ObjectName: objectName, FolderName: folderName });
    }


    useEffect(() => {
        console.log("ObjectName:", formData.ObjectName);
        console.log("FolderName:", formData.FolderName);

        const handleDownload = async () => {
            // Convert form data to JSON
            if (formData.ObjectName && formData.FolderName) {
                const jsonData = {
                    clientOrg: formData.clientOrg,
                    projectName: formData.projectName,
                    projectDescription: formData.projectDescription,
                    projectLead: formData.projectLead,
                    members: formData.members,
                    hasYubi: formData.hasYubi,
                    dataSens: formData.dataSens,
                    ObjectName: formData.ObjectName,
                    FolderName: formData.FolderName,
                    selectedEnv: formData.selectedValue,
                };

                // Convert JSON to Blob
                const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });

                // Create download link
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = 'form_data.json';
                downloadLink.click();

                // Clean up
                URL.revokeObjectURL(downloadLink.href);
            }
        };
        handleDownload();

        // method to fetch projects from gcloud api
        const fetchProjects = async () => {
            try {
                const response = await fetch(
                    'https://cloudresourcemanager.googleapis.com/v1/projects',
                    {
                        headers: {
                            Authorization: '',
                        },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    setProjects(data.projects);
                } else {
                    throw new Error('Error fetching projects');
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();

    }, [formData.ObjectName, formData.FolderName]);


    const handleSubmit = (e) => {
        e.preventDefault();
        GetName();
    };

    return (
        <form onSubmit={event => handleSubmit(event)}>
            <div className='form-group'>
                <label for="client-org">
                    Client Organization <span className='req'>*</span>
                </label>
                <input
                    type="text"
                    class="form-control"
                    id="client-org"
                    value={formData.clientOrg}
                    onChange={(e) => setFormData({ ...formData, clientOrg: e.target.value })}
                />
            </div>

            <div className='form-group'>
                <label for="project-name">
                    Project Name <span className='req'>*</span>
                </label>
                <input type="text"
                    class="form-control"
                    id="project-name"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: (e.target.value) })} maxLength="25" />

            </div >
            <div className='form-group'>
                <label for="project-desc">
                    Project Description:<span className='req'>*</span>
                </label>

                <textarea
                    value={formData.projectDescription}
                    class="form-control"
                    id="project-desc"
                    onChange={(e) => setFormData({ ...formData, projectDescription: (e.target.value) })} />
            </div >
            <div className='form-group'>
                <label for="email">
                    Project Lead (Email) <span className='req'>*</span>
                </label>
                <input
                    type="email"
                    class="form-control"
                    id="email"
                    value={formData.projectLead} onChange={(e) => setFormData({ ...formData, projectLead: (e.target.value) })} />
            </div>
            <div className='form-group'>
                <label for="project-members">
                    Project Members <span className='req'>*</span>
                </label>

                <textarea
                    value={formData.members}
                    class="form-control"
                    id="project-members"
                    onChange={(e) => setFormData({ ...formData, members: (e.target.value) })} />
            </div>

            <fieldset className='gc-chckbxrdio'>
                <legend>Do you have YubiKeys? <span className='req'>*</span></legend>
                <ul className="list-unstyled lst-spcd-2">
                    <li className="radio">
                        <label>
                            <input type="radio" value="hasYubi" checked={formData.hasYubi === "hasYubi"} onChange={(e) => setFormData({ ...formData, hasYubi: (e.target.value) })} />
                            Yes
                        </label>
                    </li>
                    <li class="radio">
                        <label>
                            <input type="radio" value="noYubi" checked={formData.hasYubi === "noYubi"} onChange={(e) => setFormData({ ...formData, hasYubi: (e.target.value) })} />
                            No
                        </label>
                    </li>
                </ul>
            </fieldset>

            <fieldset className='gc-chckbxrdio'>
                <ul className="list-unstyled lst-spcd-2">
                    <legend>Data Sensitivity of Project <span className='req'>*</span></legend>
                    <li className="radio">
                        <label>
                            <input type="radio" value="unclassified" checked={formData.dataSens === 'unclassified'} onChange={(e) => setFormData({ ...formData, dataSens: (e.target.value) })} />
                            Unclassified Data
                        </label>
                    </li>
                    <li className="radio">
                        <label>
                            <input type="radio" value="classified" checked={formData.dataSens === 'classified'} onChange={(e) => setFormData({ ...formData, dataSens: (e.target.value) })} />
                            Classified Data
                        </label>
                    </li>
                </ul>
            </fieldset>

            <fieldset className='gc-chckbxrdio'>
                <legend>Type of environment required <span className="req">*</span></legend>
                <ul className="list-unstyled lst-spcd-2">
                    {envs.map((envList) => (
                        <li
                            className="radio"
                            key={envList.value}>
                            <label>
                                <input
                                    type="radio"
                                    name="envList"
                                    value={envList}
                                    checked={envList.value}
                                    onChange={handleOptionChange}
                                />
                                {envList}
                            </label>
                        </li>
                    ))}
                </ul>
            </fieldset>
            <button class="btn btn-primary" onClick={handleSubmit} disabled={(!formData.projectName || !formData.projectDescription || !formData.clientOrg || !formData.projectLead || !formData.members || !formData.hasYubi || !formData.selectedValue)}>
                Submit Request
            </button>
        </form >
    );
}

export default Form;