const express =require('express');
const router =express.Router();
const mongoose =require('mongoose');
require("../models/Categoria");
const Categoria =mongoose.model('categorias');

router.get('/',(req, res)=>{
    res.render('admin/index')
});
router.get('/posts',(req, res)=>{
    res.send("Página de posts")
});
router.get('/categorias',(req, res)=>{
    Categoria.find().lean().sort({date:'desc'}).then(
        (categorias)=>{
            res.render("admin/categorias", {categorias:categorias});
        }
    ).catch((err)=>{
        res.redirect("/admin");
    })
    
});

router.get('/categorias/edit/:id', (req, res)=>{
    Categoria.findOne({_id:req.params.id}).lean().then(
        (categoria)=>{
            res.render('admin/editcategoria', {categoria:categoria
            })
        }
    ).catch(error=>{
        req.flash('error_msg', 'esta categoria não existe');
        res.redirect("/admin/categorias")
    });
  
});

router.post('/categorias/edit', (req, res)=>{
    const update ={
           nome:req.body.nome,
           slug: req.body.slug
    }
    Categoria.findOneAndUpdate({_id: req.body.id},update).lean().then(
        ()=>{
            req.flash("success_msg", "Categoria atualizada com sucesso");
            res.redirect("/admin/categorias")
        }
    )
    .catch(error=>{
        req.flash('error_msg', 'erro ao atualizar '+error);
        res.redirect("/admin/categorias")
    });
})

router.get('/categorias/add',(req, res)=>{
    res.render('admin/addcategorias')
});
router.post('/categoria/nova',(req, res)=>{

var errors =[];
if(!req.body.nome || typeof req.body.nome==undefined || req.body.nome==null){
  errors.push({
      text:"Nome inválido "
  });
}

if(!req.body.slug || typeof req.body.slug==undefined || req.body.slug==null){
    errors.push({
        text:"Slug inválido "
    });
  }

if(errors.length>0){
    res.render("admin/addcategorias", {erros:errors})
}
else{
    const novaCategoria ={
        nome:req.body.nome,
        slug:req.body.slug
    }
    new Categoria(novaCategoria).save().
    then(()=>{
        req.flash("success_msg", "Categoria criada com sucesso")
        res.redirect('/admin/categorias')
    })
    .catch((error)=>{
        req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!")
        res.redirect('/admin');})
}
 
});
module.exports=router;
