# Trabajar con arrays en documentos de mongoDB

# 1️⃣ Agregar un plan al usuario
await userModel.findByIdAndUpdate(userId, { $push: { plans: newPlan._id } });

# 2️⃣ Eliminar un plan del usuario
await userModel.findByIdAndUpdate(userId, { $pull: { plans: planId } });
await planModel.findByIdAndDelete(planId); # Eliminar completamente el plan

# 3️⃣ Actualizar un plan existente
await planModel.findByIdAndUpdate(planId, { 
    price: nuevoPrecio,
    mbpsupload: nuevaVelocidadUpload,
    mbpsdownload: nuevaVelocidadDownload
});