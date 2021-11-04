window.onload = () => {

    const categories = document.querySelector('#category_id')
    const subCategories = document.querySelector('#sub_category_id')

    function showSubCategories(ele, callback = null) {
        const sel = ele.options[ele.selectedIndex]

        for(i in subCategories.options){
            subCategories.options.remove(i)
        }

        const opt = document.createElement('option')
        opt.value = 0;
        opt.text = '--Seleccione--';
        subCategories.options.add(opt)

        let subs = sel.getAttribute('data-sub')
        if (subs) {
            subs = JSON.parse(subs)
            for(el of subs) {
                const opt = document.createElement('option')
                opt.value = el.id;
                opt.text = el.name;
                subCategories.options.add(opt)
            }
        }
        if (callback) {
            callback()
        }
    }

    categories.onchange = function() {
        showSubCategories(this)
    }

    if (categories.getAttribute('data-selected') != '') {
        categories.value = categories.getAttribute('data-selected')
        showSubCategories(categories, function() {
            subCategories.value = subCategories.getAttribute('data-selected')
        })
    }


    //capturo al formulario
    let formularioLogin = document.querySelector('form#form-create');

    let nameField = formularioLogin.querySelector('#name');
    let subCategoryIdField = formularioLogin.querySelector('#sub_category_id');
    let descriptionField = formularioLogin.querySelector('#description');
    let priceField = formularioLogin.querySelector('#price');

    //asigno el evento onsubmit
    formularioLogin.onsubmit = (ev) => {
        ev.preventDefault()

        for(ele of [nameField, subCategoryIdField, descriptionField, priceField]) {
            ele.classList.remove('is-invalid');
        }

        let urlSave = '/api/menu-food'
        let methodSave = 'POST'
        if (id = formularioLogin.getAttribute('data-id')) {
            urlSave = `/api/menu-food/${id}?_method=PUT`
            method = 'POST'
        }

        fetch(urlSave, {
            body: JSON.stringify({
                name: nameField.value,
                sub_category_id: subCategoryIdField.value,
                description: descriptionField.value,
                price: priceField.value
            }),
            method: methodSave,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function(res) {
            console.log(res.status)
            if (res.status == 201) {
                return res.json()
            }

            if (res.status >= 400 && res.status <= 499) {
                return res.json()
            }
        })
        .then(function(data) { 
            if (data.hasOwnProperty('errors')) {
                console.log(data.errors)
                for (fi in data.errors) {
                    const field = document.querySelector(`#${fi}`)
                    field.classList.add('is-invalid');
                    const showError = field.parentElement.querySelector('div.invalid-feedback');
                    if (showError) {
                        showError.innerText = data.errors[fi].msg;
                    }
                }
                return;
            }

            window.location.href = '/menu-food';
        })
        .catch(function(err) { console.log(err) })

    }


}