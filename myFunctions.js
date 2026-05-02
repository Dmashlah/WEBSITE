$(document).ready(function () {
  // 1. إظهار وإخفاء تفاصيل الوجبة
  $(".show-details-cb").change(function () {
    // الحصول على المعرف (ID) الخاص بصف التفاصيل المستهدف
    var targetId = $(this).data("target");

    // التحقق من حالة مربع الاختيار
    if ($(this).is(":checked")) {
      $("#" + targetId).show(); // إظهار التفاصيل
    } else {
      $("#" + targetId).hide(); // إخفاء التفاصيل
    }
  });

  // 2. إظهار نموذج الطلب عند الضغط على زر "متابعة"
  $("#continueBtn").click(function () {
    // التحقق مما إذا كان الزبون قد اختار وجبة واحدة على الأقل
    var selectedMeals = $(".select-meal-cb:checked");

    if (selectedMeals.length > 0) {
      $("#orderFormSection").show(); // إظهار النموذج
      // التمرير التلقائي إلى أسفل الصفحة لرؤية النموذج
      $("html, body").animate(
        {
          scrollTop: $("#orderFormSection").offset().top,
        },
        500,
      );
    } else {
      alert("الرجاء اختيار وجبة واحدة على الأقل قبل المتابعة.");
    }
  });

  // 3. التحقق من المدخلات عند إرسال النموذج وحساب الفاتورة
  $("#orderForm").submit(function (e) {
    e.preventDefault(); // منع الإرسال الافتراضي للنموذج حتى نتحقق من البيانات

    var isValid = true;
    var errorMsg = "";

    // --- التحقق من الاسم الكامل ---
    // أحرف هجائية فقط باللغة الإنكليزية مع فراغ واحد بين الاسم والكنية
    var fullName = $("#fullName").val().trim();
    var nameRegex = /^[A-Za-z]+ [A-Za-z]+$/;
    if (fullName !== "" && !nameRegex.test(fullName)) {
      isValid = false;
      errorMsg +=
        "- الاسم يجب أن يحتوي أحرف إنكليزية فقط مع فراغ واحد بين الاسم والكنية.\n";
    }

    // --- التحقق من رقم الحساب المصرفي (واجب الإدخال) ---
    // مؤلف من 6 خانات ويمكن أن يبدأ بصفر
    var bankAccount = $("#bankAccount").val().trim();
    var bankRegex = /^\d{6}$/;
    if (bankAccount === "" || !bankRegex.test(bankAccount)) {
      isValid = false;
      errorMsg += "- رقم الحساب المصرفي مطلوب ويجب أن يتألف من 6 أرقام.\n";
    }

    // --- التحقق من تاريخ الطلب ---
    // تاريخ صحيح من الشكل dd-mm-yyyy
    var orderDate = $("#orderDate").val().trim();
    var dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{4}$/;
    if (orderDate !== "" && !dateRegex.test(orderDate)) {
      isValid = false;
      errorMsg += "- تاريخ الطلب غير صالح. يجب أن يكون بصيغة (dd-mm-yyyy).\n";
    }

    // --- التحقق من رقم الموبايل ---
    // يطابق أرقام شبكتي Syriatel و MTN (يبدأ بـ 09 ويليه 8 أرقام، والمفتاح يطابق الشبكات السورية)
    var mobileNumber = $("#mobileNumber").val().trim();
    var mobileRegex = /^09[345689]\d{7}$/;
    if (mobileNumber !== "" && !mobileRegex.test(mobileNumber)) {
      isValid = false;
      errorMsg += "- رقم الموبايل يجب أن يطابق أرقام شبكتي Syriatel أو MTN.\n";
    }

    // إذا كان هناك أخطاء، قم بإظهار رسالة وتوقف عن التنفيذ
    if (!isValid) {
      alert("يرجى تصحيح الأخطاء التالية:\n\n" + errorMsg);
      return; // إيقاف التنفيذ
    }

    // --- 4. في حال النجاح: حساب الفاتورة وإظهار النافذة النهائية ---
    var totalAmount = 0;
    var mealsInfo = "";

    // المرور على جميع الوجبات التي تم اختيارها
    $(".select-meal-cb:checked").each(function () {
      var price = parseFloat($(this).val()); // جلب السعر من قيمة الـ checkbox
      var row = $(this).closest("tr");
      var mealName = row.find("td:eq(1)").text(); // جلب اسم الوجبة من العمود الثاني

      totalAmount += price;
      mealsInfo += "🍽️ " + mealName + " - (" + price + " ل.س)\n";
    });

    // حساب الضريبة والمبلغ الصافي
    var taxAmount = totalAmount * 0.1; // ضريبة 10%
    var netAmount = totalAmount + taxAmount; // المبلغ الصافي

    // تجهيز وإظهار رسالة النجاح والفاتورة
    var summaryMsg = "✅ تم إرسال طلبك بنجاح!\n\n";
    summaryMsg += "=== تفاصيل الوجبات ===\n" + mealsInfo + "\n";
    summaryMsg += "المجموع الإجمالي: " + totalAmount + " ل.س\n";
    summaryMsg += "مبلغ الضريبة (10%): " + taxAmount + " ل.س\n";
    summaryMsg += "-----------------------------------\n";
    summaryMsg += "المبلغ الصافي: " + netAmount + " ل.س\n";

    alert(summaryMsg); // إظهار النافذة التي تتضمن المعلومات المطلوبة
  });
});
