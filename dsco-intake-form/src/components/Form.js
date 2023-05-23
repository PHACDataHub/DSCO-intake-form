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
                            Authorization: 'AIzaSyCeZR7PtMTVZo7cED1RrLXA6Cow-BNdKeM',
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
        <form className='form-data' onSubmit={event => handleSubmit(event)}>
            <div className='forminput'>
                <label>
                    <div className='title-input'>
                        Client Organization:<span className='req'>*</span>
                    </div>

                    <input
                        type="text"
                        value={formData.clientOrg}
                        onChange={(e) => setFormData({ ...formData, clientOrg: e.target.value })}
                    />
                </label>
            </div>
            <div className='forminput'>
                <label>
                    <div className='title-input'>
                        Project Name<span className='req'>*</span>
                    </div>
                    <input type="text" value={formData.projectName} onChange={(e) => setFormData({ ...formData, projectName: (e.target.value) })} maxLength="25" />
                </label>
            </div >
            <div className='forminput'>
                <label>
                    <div className='title-input'>
                        Project Description:<span className='req'>*</span>
                    </div>
                    <textarea value={formData.projectDescription} onChange={(e) => setFormData({ ...formData, projectDescription: (e.target.value) })} />
                </label>
            </div >
            <div className='forminput'>
                <label>
                    <div className='title-input'>
                        Project Lead (Email)<span className='req'>*</span>
                    </div>
                    <input type="email" value={formData.projectLead} onChange={(e) => setFormData({ ...formData, projectLead: (e.target.value) })} />
                </label>
            </div>
            <div className='forminput'>
                <label>
                    <div className='title-input'>
                        Project Members:<span className='req'>*</span>
                    </div>
                    <textarea value={formData.members} onChange={(e) => setFormData({ ...formData, members: (e.target.value) })} />
                </label>
            </div>
            <div className='forminput'>
                <label>
                    <div className='title-input'>
                        Do you have YubiKeys?:<span className='req'>*</span>
                    </div>
                </label>
                <label>
                    <div className='form-radio'>
                        <input type="radio" value="hasYubi" checked={formData.hasYubi === "hasYubi"} onChange={(e) => setFormData({ ...formData, hasYubi: (e.target.value) })} />
                        Yes
                    </div>
                </label>
                <label>
                    <div className='form-radio'>
                        <input type="radio" value="noYubi" checked={formData.hasYubi === "noYubi"} onChange={(e) => setFormData({ ...formData, hasYubi: (e.target.value) })} />
                        No
                    </div>
                </label>
            </div>
            <div className='forminput'>
                <label>
                    <div className='title-input'>
                        Data Sensitivity of Project:<span className='req'>*</span>
                    </div>
                </label>
                <label>
                    <div className='form-radio'>
                        <input type="radio" value="unclassified" checked={formData.dataSens === 'unclassified'} onChange={(e) => setFormData({ ...formData, dataSens: (e.target.value) })} />
                        Unclassified Data
                    </div>
                </label>
                <label>
                    <div className='form-radio'>

                        <input type="radio" value="classified" checked={formData.dataSens === 'classified'} onChange={(e) => setFormData({ ...formData, dataSens: (e.target.value) })} />
                        Classified Data
                    </div>
                </label>
            </div>
            <div className="env-options">
                <p>Type of environment required <span className="req">*</span></p>
                <ul>

                    {envs.map((envList) => (
                        <li key={envList.value}>
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
            </div>
            <button onClick={handleSubmit} disabled={(!formData.projectName || !formData.projectDescription || !formData.clientOrg || !formData.projectLead || !formData.members || !formData.hasYubi || !formData.selectedValue)}>
                Submit Request
            </button>
        </form >
    );
}

export default Form;